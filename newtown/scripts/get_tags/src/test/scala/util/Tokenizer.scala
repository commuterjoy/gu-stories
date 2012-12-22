import util._
import org.scalatest.FunSuite
import scala.collection.JavaConversions._

class TokenizerTest extends FunSuite {

  val text = """
      The court was told by lawyers acting for alleged victims there were now 155 new
      claims being brought by 175 claimants, including public figures such as Cherie
      Blair and Sarah Ferguson, and celebrities such as former Doctor Who star Christopher
      Eccleston and Hugh Grant.

      Dinah Rose, QC for News International, asked the court to strike out the claims for
      exemplary damages on several grounds. Opening her argument, she questioned whether
      they should be paid out for alleged misuse of private information.
      """

  val tokenizer = new Tokenizer

  test("should split a body of text in to a list of sentences") {
    val sentances = tokenizer.tokenize(text)
    assert(sentances.length == 3)
  }
}