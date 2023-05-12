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
  BaseModel,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Auction from './Auction'
import ProjectMembership from './ProjectMembership'
import Message from './Message'
import Profile from './Profile'
import File from './File'
import Tender from './Tender'
import TenderBid from './TenderBid'
import AuctionBid from './AuctionBid'
import OrganizationMembership from './OrganizationMembership'
import Token from './Token'

export default class User extends BaseModel {
  public static search = ['firstName', 'lastName', 'patronymicName', 'email']

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public verifiedAt: DateTime | null

  @column.date()
  public bornAt: DateTime

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

  @column()
  public patronymicName: string

  @hasMany(() => Token)
  public tokens: HasMany<typeof Token>

  @hasMany(() => Profile)
  public profiles: HasMany<typeof Profile>

  @hasManyThrough([() => Auction, () => Profile])
  public auctions: HasManyThrough<typeof Auction>

  @hasManyThrough([() => AuctionBid, () => Profile])
  public auctionBids: HasManyThrough<typeof AuctionBid>

  @hasManyThrough([() => ProjectMembership, () => Profile])
  public projectMemberships: HasManyThrough<typeof ProjectMembership>

  @hasMany(() => OrganizationMembership)
  public organizationMemberships: HasMany<typeof OrganizationMembership>

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
