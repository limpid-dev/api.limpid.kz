import { string } from '@ioc:Adonis/Core/Helpers'
import { LucidModel, SnakeCaseNamingStrategy } from '@ioc:Adonis/Lucid/Orm'

export default class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
  public serializedName(_model: LucidModel, attributeName: string) {
    return string.camelCase(attributeName)
  }
  public paginationMetaKeys() {
    return {
      total: 'total',
      perPage: 'perPage',
      currentPage: 'currentPage',
      lastPage: 'lastPage',
      firstPage: 'firstPage',
      firstPageUrl: 'firstPageUrl',
      lastPageUrl: 'lastPageUrl',
      nextPageUrl: 'nextPageUrl',
      previousPageUrl: 'previousPageUrl',
    }
  }
}
