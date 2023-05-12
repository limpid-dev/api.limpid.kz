import {
  BelongsTo,
  HasMany,
  beforeSave,
  belongsTo,
  column,
  hasMany,
  BaseModel,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Auction from './Auction'
import AuctionBid from './AuctionBid'
import Certificate from './Certificate'
import Contact from './Contact'
import Education from './Education'
import Experience from './Experience'
import ProjectMembership from './ProjectMembership'
import Skill from './Skill'
import Tender from './Tender'
import TenderBid from './TenderBid'
import User from './User'

export default class Profile extends BaseModel {
  public static search = ['title', 'description', 'location', 'industry']

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public verifiedAt: DateTime | null

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public location: string | null

  @column()
  public industry: string

  @column()
  public ownedIntellectualResources: string

  @column()
  public ownedMaterialResources: string

  @column()
  public isVisible: boolean

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => Contact)
  public contacts: HasMany<typeof Contact>

  @hasMany(() => Skill)
  public skills: HasMany<typeof Skill>

  @hasMany(() => ProjectMembership)
  public projectMemberships: HasMany<typeof ProjectMembership>

  @hasMany(() => Education)
  public educations: HasMany<typeof Education>

  @hasMany(() => Certificate)
  public certificates: HasMany<typeof Certificate>

  @hasMany(() => Experience)
  public experiences: HasMany<typeof Experience>

  @hasMany(() => Auction)
  public auctions: HasMany<typeof Auction>

  @hasMany(() => AuctionBid)
  public auctionBids: HasMany<typeof AuctionBid>

  @hasMany(() => Tender)
  public tenders: HasMany<typeof Tender>

  @hasMany(() => TenderBid)
  public tenderBids: HasMany<typeof TenderBid>

  @beforeSave()
  public static async beforeSave(profile: Profile) {
    if (profile.$isDirty) {
      profile.verifiedAt = null
    }
  }
}
