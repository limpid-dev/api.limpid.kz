import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  HasOne,
  hasOne,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'
import ProfileMember from './ProfileMember'
import Chat from './Chat'
import ChatMember from './ChatMember'

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
  public patronymic: string

  @column.dateTime()
  public emailVerifiedAt: DateTime | null

  @column.date()
  public bornAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Profile)
  public profiles: HasMany<typeof Profile>

  @hasMany(() => ProfileMember)
  public profileMemberships: HasMany<typeof ProfileMember>

  @hasMany(() => Chat)
  public chats: HasMany<typeof Chat>

  @hasMany(() => ChatMember)
  public chatMemberships: HasMany<typeof ChatMember>

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
