import Hash from '@ioc:Adonis/Core/Hash'
import {
  HasMany,
  HasManyThrough,
  HasOne,
  beforeSave,
  column,
  hasMany,
  hasManyThrough,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import AppBaseModel from './AppBaseModel'
import Auction from './Auction'
import Membership from './Membership'
import Message from './Message'
import Notification from './Notification'
import Profile from './Profile'
import Project from './Project'
import File from './File'
import Tender from './Tender'
import TenderBid from './TenderBid'

export default class User extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public verifiedAt: DateTime | null

  @column()
  public fileId: number | null

  @hasOne(() => File)
  public file: HasOne<typeof File>

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

  @hasManyThrough([() => Tender, () => Profile])
  public tenders: HasManyThrough<typeof Tender>

  @hasManyThrough([() => TenderBid, () => Profile])
  public tenderBids: HasManyThrough<typeof TenderBid>

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
