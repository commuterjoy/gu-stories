
import util.ContentApi
import org.apache.commons.io._
import com.codahale.jerkson.Json._
import dispatch._

object Tags {

  // exports Content API responses to the file system as JSON
  private def export(tag: String): List[(String, String)] = {
    ContentApi.
      all(tag).map({ response =>
        var responseAsJson = generate(response) // http://java.dzone.com/articles/processing-json-scala-jerkson
        (response.id, responseAsJson)
    })
  }

  def exportToFileSystem(tag: String, base: String) = {

    println(tag)

    export(tag).foreach{ case (id, json) => {
      println(id)
      val filePath = base + id
      FileUtils.writeStringToFile(new java.io.File(filePath), json, "utf8", true)
      }
    }
  }

  def exportToElasticSearch(tag: String) = {

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

  def main(args: Array[String]) = {

    val tag = args.first
    val outputBase = "target/" + tag + "/"

    println(outputBase)

    //Tags.exportToElasticSearch(tag)
    Tags.exportToFileSystem(tag, outputBase)
  }
}