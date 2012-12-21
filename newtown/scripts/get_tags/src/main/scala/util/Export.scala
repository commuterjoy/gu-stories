package util

import org.apache.commons.io._
import com.codahale.jerkson.Json._
import dispatch._
import org.jsoup._

case class Resource(contentApi: com.gu.openplatform.contentapi.model.Content, entities: List[util.NamedEntity])

object Export {

  val ner = new NamedEntityService("english.conll.4class.distsim.crf.ser.gz")

  // merges Content API + NER term extraction
  private def export(tag: String): List[(String, String)] = {
    ContentApi.
      all(tag).map({ response =>
      val body = response.fields.getOrElse("body", "")
      val bodyRaw = Jsoup.parse(body.toString).text();
      val entities = ner.classify(bodyRaw)
      val resource = new Resource(response, entities)
      val resourceAsJson = generate(resource) // http://java.dzone.com/articles/processing-json-scala-jerkson
      (response.id, resourceAsJson)
    })
  }

  // exports Content API response to the file system as JSON
  def toFileSystem(tag: String, base: String) = {
    export(tag).foreach{ case (id, response) => {
      val filePath = base + id
      FileUtils.writeStringToFile(new java.io.File(filePath), response, "utf8", true)
      }
    }
  }

  def toElasticSearch(tag: String) = {

    export(tag).foreach{ case (id, json) => {
      var event = tag.split("/").last
      val key = id.split("/").last
      var resource = "http://localhost:9200/events/" + event + "/" + key

      val elastic = url(resource).PUT
        .setBody(json)
        .addHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8")

      val result = Http(elastic OK as.String).either

      result() match {
        case Right(content)         => println("Content: " + content)
        case Left(StatusCode(code)) => println("Some other code: " + code.toString)
        }
      }
    }
  }

}
