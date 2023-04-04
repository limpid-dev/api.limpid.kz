import {
  BaseModel,
  BelongsTo,
  HasMany,
  ModelQueryBuilderContract,
  beforeFetch,
  beforeSave,
  belongsTo,
  column,
  computed,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import User from './User'
import Resource from './Resource'
import Contact from './Contact'

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

  @hasMany(() => Resource)
  public resources: HasMany<typeof Resource>

  @hasMany(() => Contact)
  public contacts: HasMany<typeof Contact>

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
