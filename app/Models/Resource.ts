import {
  BaseModel,
  BelongsTo,
  beforeCreate,
  beforeSave,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Profile from './Profile'

export type Type = 'MATERIAL' | 'INTELLECTUAL'

export default class Resource extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public verifiedAt: DateTime | null

  @column()
  public type: Type

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public profileId: number

  @belongsTo(() => Profile)
  public profile: BelongsTo<typeof Profile>

  @beforeSave()
  public static async beforeSave(resource: Resource) {
    if (resource.$isDirty) {
      resource.verifiedAt = null
    }
  }
}
