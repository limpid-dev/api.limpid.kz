import Hash from '@ioc:Adonis/Core/Hash'
import {
  BaseModel,
  HasMany,
  HasOne,
  beforeSave,
  column,
  hasMany,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import ApiToken from './ApiToken'
import Profile from './Profile'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public selectedProfileId: number

  @hasOne(() => Profile)
  public selectedProfile: HasOne<typeof Profile>

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public patronymic: string | null

  @column.dateTime()
  public emailVerifiedAt: DateTime | null

  @column.date()
  public bornAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => ApiToken)
  public apiTokens: HasMany<typeof ApiToken>

  @hasMany(() => Profile, {
    onQuery(query) {
      query.where('isPersonal', true)
    },
  })
  public profiles: HasMany<typeof Profile>

  @hasMany(() => Profile, {
    onQuery(query) {
      query.where('isPersonal', false)
    },
  })
  public organizations: HasMany<typeof Profile>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeSave()
  public static async unverifyEmail(user: User) {
    if (user.$dirty.email) {
      user.emailVerifiedAt = null
    }
  }
}
