import Hash from '@ioc:Adonis/Core/Hash'
import {
  BaseModel,
  HasMany,
  HasOne,
  beforeSave,
  column,
  hasMany,
  hasOne,
  BelongsTo, 
  belongsTo,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import ChatMember from './ChatMember'
import ChatMessage from './ChatMessage'
import Profile from './Profile'
import ProfileMember from './ProfileMember'
import Invoice from './Invoice'
import Notification from './Notification'
import SubPlans from './SubPlans'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public selectedProfileId: number | null

  @hasOne(() => Profile)
  public selectedProfile: HasOne<typeof Profile>

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public secret: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public patronymic: string | null

  @column()
  public projects_attempts: number

  @column()
  public auctions_attempts: number

  @column.dateTime({ autoCreate: true })
  public payment_start: DateTime

  @column.dateTime()
  public payment_end: DateTime

  @column()
  public planId: number

  @column.dateTime()
  public emailVerifiedAt: DateTime | null

  @column.date()
  public bornAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Profile)
  public profiles: HasMany<typeof Profile>

  @hasMany(() => ProfileMember)
  public profileMemberships: HasMany<typeof ProfileMember>

  @hasMany(() => ChatMember)
  public chatMemberships: HasMany<typeof ChatMember>

  @hasMany(() => ChatMessage)
  public chatMessages: HasMany<typeof ChatMessage>

  @hasMany(() => Invoice)
  public invoices: HasMany<typeof Invoice>

  @hasMany(() => Notification)
  public notifications: HasMany<typeof Notification>

  @belongsTo(() => SubPlans)
  public plans: BelongsTo<typeof SubPlans>

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
