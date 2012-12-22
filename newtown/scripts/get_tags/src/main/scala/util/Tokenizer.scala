package util

import edu.stanford.nlp.process.DocumentPreprocessor
import java.io.{File, FileWriter, BufferedWriter}
import scala.collection.JavaConversions._
import org.jsoup._

class Tokenizer {

  def wrapTextInTemporaryFile(text: String) = {
    val temp = File.createTempFile("foo", "bar")
    val fw = new FileWriter(temp)
    var bw = new BufferedWriter(fw)
    bw.write(text)
    bw.close
    temp
  }

  def tokenize(text: String) = {
    val dp = new DocumentPreprocessor(wrapTextInTemporaryFile(text).getAbsolutePath())
    dp.map( sentence => {
      sentence.mkString(" ")
    }).toList
  }

}