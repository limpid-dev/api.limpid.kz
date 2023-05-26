import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
  hasOne,
  HasOne,
  hasManyThrough,
  HasManyThrough,
} from '@ioc:Adonis/Lucid/Orm'
import ApiToken from './ApiToken'
import Profile from './Profile'
import Tender from './Tender'
import TenderBid from './TenderBid'

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
  public patronymicName: string | null

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

  @hasMany(() => Profile)
  public profiles: HasMany<typeof Profile>

  @hasManyThrough([() => Tender, () => Profile])
  public tenders: HasManyThrough<typeof Tender>

  @hasManyThrough([() => TenderBid, () => Profile])
  public tenderBids: HasManyThrough<typeof TenderBid>

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
