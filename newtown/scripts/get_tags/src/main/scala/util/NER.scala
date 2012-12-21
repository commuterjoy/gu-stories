package util

import edu.stanford.nlp.ie.crf._
import edu.stanford.nlp.ie.AbstractSequenceClassifier
import edu.stanford.nlp.ling.CoreLabel
import edu.stanford.nlp.ling.CoreAnnotations.AnswerAnnotation

import scala.collection.BufferedIterator
import scala.collection.mutable.HashMap
import scala.collection.JavaConversions._

trait NamedEntity {
  val text      : String
  val entity      : String
  var frequency : Int
}

case class Organization(val text : String, var frequency : Int = 0) extends NamedEntity {
  override val entity = "Organisation"
}
case class Person(val text : String, var frequency : Int = 0) extends NamedEntity {
  override val entity = "Person"
}
case class Location(val text : String, var frequency : Int = 0) extends NamedEntity {
  override val entity = "Location"
}
case class Misc(val text : String, var frequency : Int = 0) extends NamedEntity {
  override val entity = "Misc"
}

class NamedEntityService(dictionary: String = "english.all.3class.distsim.crf.ser.gz") {

  val classifier = CRFClassifier.getClassifierNoExceptions(dictionary)

  def classify(text : String) : List[NamedEntity] = {

    val results   = classifier.classify(text)

    val entities  = asScalaBuffer(results).foldLeft(new HashMap[String, NamedEntity]) {

      (entities, sentence) => {

        var tokens = asScalaBuffer(sentence).map(_.asInstanceOf[CoreLabel]).iterator.buffered

        while (tokens.hasNext) {

          getAnnotationType(tokens.head) match {
            case "ORGANIZATION" => addNamedEntity(entities, new Organization(getNamedEntityForAnnotation(tokens, "ORGANIZATION")))
            case "LOCATION"     => addNamedEntity(entities, new Location(getNamedEntityForAnnotation(tokens, "LOCATION")))
            case "PERSON"       => addNamedEntity(entities, new Person(getNamedEntityForAnnotation(tokens, "PERSON")))
            case "MISC"         => addNamedEntity(entities, new Misc(getNamedEntityForAnnotation(tokens, "MISC")))
            case _              => tokens.next
          }

        }

        entities

      }
    }

    entities.values.toList

  }

  private def addNamedEntity(entities : HashMap[String, NamedEntity], entity : NamedEntity) {
    entities.getOrElseUpdate(entity.text, entity).frequency += 1
  }

  private def getNamedEntityForAnnotation(tokens : BufferedIterator[CoreLabel], annotation : String) : String = {
    tokens.takeWhile { s => getAnnotationType(s) == annotation }.map(_.word).mkString(" ")
  }

  private def getAnnotationType(token : CoreLabel) : String = {
    token.get[String, AnswerAnnotation](classOf[AnswerAnnotation])
  }

}
