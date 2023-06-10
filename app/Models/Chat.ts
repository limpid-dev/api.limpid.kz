import { BaseModel, HasMany, HasOne, ModelQueryBuilderContract, beforeFetch, beforeFind, beforePaginate, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import ChatMember from './ChatMember'
import ChatMessage from './ChatMessage'
import Project from './Project'

type ChatQuery = ModelQueryBuilderContract<typeof Chat>

export default class Chat extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public projectId: number | null

  @hasOne(() => Project)
  public project: HasOne<typeof Project>

  @column()
  public name: string

  @hasMany(() => ChatMember)
  public members: HasMany<typeof ChatMember>

  @hasMany(() => ChatMessage)
  public messages: HasMany<typeof ChatMessage>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime


  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime | null

  public async softDelete() {
    this.deletedAt = DateTime.now()
    await this.save()
  }

  @beforeFetch()
  public static fetchWithoutSoftDeletes(query: ChatQuery) {
    query.whereNull('deleted_at')
  }

  @beforeFind()
  public static findWithoutSoftDeletes(query: ChatQuery) {
    query.whereNull('deleted_at')
  }

  @beforePaginate()
  public static paginateWithoutSoftDeletes([countQuery, query]: [
    ChatQuery,
    ChatQuery
  ]): void {
    countQuery.whereNull('deleted_at')
    query.whereNull('deleted_at')
  }
}
