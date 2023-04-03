import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'

export type Type = 'MATERIAL' | 'INTELLECTUAL'

export default class Resource extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ serializeAs: null, autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public verifiedAt: DateTime | null

  @column()
  public type: Type

  @column()
  public title: string

  @column()
  public description: string

  @column({
    serializeAs: null,
  })
  public profileId: number

  @belongsTo(() => Profile)
  public profile: BelongsTo<typeof Profile>

  @computed()
  public get isVerified() {
    return !!this.verifiedAt
  }
}
