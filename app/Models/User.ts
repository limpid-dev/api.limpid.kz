import Hash from '@ioc:Adonis/Core/Hash'
import {
  BaseModel,
  beforeSave,
  column,
  HasMany,
  hasMany,
  HasManyThrough,
  hasManyThrough,
  HasOne,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Auction from './Auction'
import AuctionBid from './AuctionBid'
import File from './File'
import OrganizationMembership from './OrganizationMembership'
import Profile from './Profile'
import ProjectMembership from './ProjectMembership'
import Tender from './Tender'
import TenderBid from './TenderBid'
import Token from './Token'
import Invoice from './Invoice'

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

  @column()
  public projects_atmpts: number

  @column()
  public auction_atmpts: number

  @column.dateTime({ autoCreate: true })
  public payment_start: DateTime

  @column.dateTime()
  public payment_end: DateTime

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

  @hasManyThrough([() => Tender, () => Profile])
  public tenders: HasManyThrough<typeof Tender>

  @hasManyThrough([() => TenderBid, () => Profile])
  public tenderBids: HasManyThrough<typeof TenderBid>

  @hasMany(() => Invoice)
  public invoices: HasMany<typeof Invoice>

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
