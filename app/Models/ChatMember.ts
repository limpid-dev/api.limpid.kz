import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Chat from './Chat'
import User from './User'

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
