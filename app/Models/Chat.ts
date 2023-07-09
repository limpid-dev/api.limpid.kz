import {
  BaseModel,
  HasMany,
  HasOne,
  column,
  computed,
  hasMany,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import ChatMember from './ChatMember'
import ChatMessage from './ChatMessage'
import Project from './Project'

export default class Chat extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public projectId: number | null

  @hasOne(() => Project)
  public project: HasOne<typeof Project>

  @computed()
  public get isProjectChat() {
    return !!this.projectId
  }

  @column()
  public name: string

  @hasMany(() => ChatMember)
  public members: HasMany<typeof ChatMember>

  @hasMany(() => ChatMessage)
  public messages: HasMany<typeof ChatMessage>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
