import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public expiresAt: DateTime | null

  @column()
  public type: string

  @column()
  public token: string

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
