import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import ChatMember from './ChatMember'

export default class ChatMessage extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public chatMemberId: number

  @belongsTo(() => ChatMember)
  public chatMember: BelongsTo<typeof ChatMember>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
