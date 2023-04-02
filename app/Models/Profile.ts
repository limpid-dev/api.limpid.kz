import {
  BaseModel,
  BelongsTo,
  ModelQueryBuilderContract,
  beforeFetch,
  beforeSave,
  belongsTo,
  column,
  computed,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import User from './User'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public verifiedAt: DateTime | null

  @computed()
  public get isVerified() {
    return !!this.verifiedAt
  }

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public location: string | null

  @column()
  public industry: string

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @beforeSave()
  public static async resetVerifiedAt(profile: Profile) {
    if (profile.$isDirty) {
      profile.verifiedAt = null
    }
  }

  @beforeFetch()
  public static fetchOnlyVerified(query: ModelQueryBuilderContract<typeof Profile>) {
    query.whereNotNull('verified_at')
  }
}
