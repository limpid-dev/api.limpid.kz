import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import File from './File'

export default class Auction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => File)
  public files: HasMany<typeof File>

  @column()
  public title: string

  @column()
  public description: string

  @column.dateTime()
  public startedAt: DateTime

  @column.dateTime()
  public finishedAt: DateTime

  @column()
  public startingPrice: number | null
}
