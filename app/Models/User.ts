import Hash from '@ioc:Adonis/Core/Hash'
import {
  BaseModel,
  HasMany,
  HasManyThrough,
  beforeSave,
  column,
  hasMany,
  hasManyThrough,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Profile from './Profile'
import Notification from './Notification'
import Project from './Project'
import Auction from './Auction'
import Message from './Message'
import Membership from './Membership'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public verifiedAt: DateTime | null

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public rememberMeToken: string | null

  @column()
  public firstName: string

  @column()
  public lastName: string

  @hasMany(() => Profile)
  public profiles: HasMany<typeof Profile>

  @hasMany(() => Notification)
  public notifications: HasMany<typeof Notification>

  @hasManyThrough([() => Project, () => Profile])
  public projects: HasManyThrough<typeof Project>

  @hasManyThrough([() => Auction, () => Profile])
  public auctions: HasManyThrough<typeof Auction>

  @hasManyThrough([() => Membership, () => Profile])
  public memberships: HasManyThrough<typeof Membership>

  @hasManyThrough([() => Message, () => Profile])
  public messages: HasManyThrough<typeof Message>

  @beforeSave()
  public static async beforeSave(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
    if (user.$dirty.email) {
      user.verifiedAt = null
    }
  }
}
