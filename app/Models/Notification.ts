import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public type: string

  @column()
  public meta: Record<string, string | number | boolean | null>

  @column.dateTime({
    autoCreate: true,
  })
  public sendAt: DateTime

  @column.dateTime()
  public readAt: DateTime | null
}
