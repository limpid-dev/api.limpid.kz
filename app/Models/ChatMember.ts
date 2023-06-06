import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Chat from './Chat'
import ChatMessage from './ChatMessage'

export default class ChatMember extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public chatId: number

  @belongsTo(() => Chat)
  public chat: BelongsTo<typeof Chat>

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => ChatMessage)
  public messages: HasMany<typeof ChatMessage>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
