import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Chat from './Chat'
import User from './User'

export default class ChatMessage extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public chatId: number

  @belongsTo(() => Chat)
  public chat: BelongsTo<typeof Chat>

  @column()
  public message: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
