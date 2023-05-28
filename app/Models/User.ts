import Hash from '@ioc:Adonis/Core/Hash'
import {
  BaseModel,
  HasMany,
  HasOne,
  ManyToMany,
  beforeSave,
  column,
  hasMany,
  hasOne,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import ApiToken from './ApiToken'
import Profile from './Profile'
import Organization from './Organization'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public selectedOrganizationId: number | null

  @hasOne(() => Organization)
  public selectedOrganization: HasOne<typeof Organization>

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

  @hasOne(() => Profile, {
    onQuery(query) {
      query.where('isPersonal', true)
    },
  })
  public profile: HasOne<typeof Profile>

  @hasMany(() => Profile, {
    onQuery(query) {
      query.where('isPersonal', false)
    },
  })
  public organizations: HasMany<typeof Organization>

  @manyToMany(() => Profile, {
    pivotTable: 'profile_user',
    onQuery(query) {
      query.where('isPersonal', false)
    },
    pivotTimestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  })
  public organizationMemberships: ManyToMany<typeof Profile>

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
