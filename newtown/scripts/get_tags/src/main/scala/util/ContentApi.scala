package util

import com.gu.openplatform.contentapi.Api
import com.gu.openplatform.contentapi.connection.{ JavaNetHttp }

class ContentApiClient extends Api with JavaNetHttp {

  apiKey = Some(System.getenv("ContentApiKey"))

  override protected def fetch(url: String, parameters: Map[String, Any]) = {
    super.fetch(url, parameters + ("user-tier" -> "internal"))
  }

  // tail recursion : http://oldfashionedsoftware.com/2008/09/27/tail-recursion-basics-in-scala/
  def all(tag: String, page: Int = 1, items: List[com.gu.openplatform.contentapi.model.Content] = Nil): List[com.gu.openplatform.contentapi.model.Content] = {
    val maxPages = 10
    val search = super.
      search.
      page(page).
      showFields("all").
      showTags("all").
      showMedia("all").
      pageSize(50).
      tag(tag)
    val itemsCombined = items ::: search.response.results

    if (search.currentPage == search.pages || search.currentPage.toInt >= maxPages) itemsCombined
    else all(tag, page + 1, itemsCombined)
  }
}

object ContentApi extends ContentApiClient()