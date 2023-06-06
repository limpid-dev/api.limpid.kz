import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import ChatMember from './ChatMember'
import ChatMessage from './ChatMessage'

export default class Chat extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @hasMany(() => ChatMember)
  public members: HasMany<typeof ChatMember>

  @hasMany(() => ChatMessage)
  public messages: HasMany<typeof ChatMessage>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
