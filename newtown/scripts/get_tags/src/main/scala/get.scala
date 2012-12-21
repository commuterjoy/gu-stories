
import util._

object Tags {

  def main(args: Array[String]) = {

    val tag = args.first
    val outputBase = "target/" + tag + "/"

    Export.toFileSystem(tag, outputBase)
  }
}