import { DateTime } from 'luxon'
import { BaseModel, ModelQueryBuilderContract, beforeFetch, column } from '@ioc:Adonis/Lucid/Orm'

export default class Location extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public verifiedAt: DateTime | null

  @column()
  public city: string

  @column()
  public region: string

  @column()
  public country: string

  @beforeFetch()
  public static fetchOnlyVerified(query: ModelQueryBuilderContract<typeof Location>) {
    query.whereNotNull('verified_at')
  }
}
