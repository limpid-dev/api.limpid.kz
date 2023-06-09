import { AttachmentContract, attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Certificate from './Certificate'
import Education from './Education'
import Experience from './Experience'
import ProfileMember from './ProfileMember'
import ProjectMember from './ProjectMember'
import Skill from './Skill'
import Tender from './Tender'
import TenderBid from './TenderBid'
import User from './User'
import Auction from './Auction'
import AuctionBid from './AuctionBid'
import Rating from './Rating'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public displayName: string

  @column()
  public description: string

  @column()
  public location: string

  @column()
  public industry: string

  @column()
  public ownedIntellectualResources: string | null

  @column()
  public ownedMaterialResources: string | null

  @column()
  public tin: string

  @column()
  public performance: string | null

  @column()
  public legalStructure: string | null

  @column()
  public views: number

  @column()
  public isVisible: boolean

  @column()
  public isPersonal: boolean

  @attachment({ preComputeUrl: true })
  public avatar: AttachmentContract | null

  @column()
  public instagramUrl: string | null

  @column()
  public whatsappUrl: string | null

  @column()
  public websiteUrl: string | null

  @column()
  public telegramUrl: string | null

  @column()
  public twoGisUrl: string | null

  @column.dateTime()
  public tinVerifiedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => ProfileMember)
  public members: HasMany<typeof ProfileMember>

  @hasMany(() => Education)
  public educations: HasMany<typeof Education>

  @hasMany(() => Experience)
  public experiences: HasMany<typeof Experience>

  @hasMany(() => Certificate)
  public certificates: HasMany<typeof Certificate>

  @hasMany(() => Skill)
  public skills: HasMany<typeof Skill>

  @hasMany(() => Tender)
  public tenders: HasMany<typeof Tender>

  @hasMany(() => TenderBid)
  public tenderBids: HasMany<typeof TenderBid>

  @hasMany(() => Auction)
  public auctions: HasMany<typeof Auction>

  @hasMany(() => Rating)
  public ratings: HasMany<typeof Rating>

  @hasMany(() => AuctionBid)
  public auctionBids: HasMany<typeof AuctionBid>

  @hasMany(() => ProjectMember)
  public projectMemberships: HasMany<typeof ProjectMember>
}
