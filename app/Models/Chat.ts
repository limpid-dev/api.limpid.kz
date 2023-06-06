import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import ChatMember from './ChatMember'
import User from './User'

export default class Chat extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => ChatMember)
  public members: HasMany<typeof ChatMember>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
