import { DateTime, Duration } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  HasOne,
  belongsTo,
  column,
  computed,
  hasMany,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import { duration } from 'App/Utilities/Duration'
import { AttachmentContract, attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import AuctionBid from './AuctionBid'
import Profile from './Profile'

export default class Auction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public profileId: number

  @belongsTo(() => Profile)
  public profile: BelongsTo<typeof Profile>

  @column()
  public wonAuctionBidId: number | null

  @hasOne(() => AuctionBid)
  public wonAuctionBid: HasOne<typeof AuctionBid>

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public industry: string

  @column()
  public startingPrice: number | null

  @column()
  public purchasePrice: number | null

  @duration()
  public duration: Duration

  @column.dateTime()
  public verifiedAt: DateTime | null

  @column()
  public type: string

  @computed()
  public get startedAt() {
    return this.verifiedAt
  }

  @computed()
  public get finishedAt() {
    return this.verifiedAt ? this.verifiedAt.plus(this.duration) : null
  }

  @hasMany(() => AuctionBid)
  public bids: HasMany<typeof AuctionBid>

  @attachment({ preComputeUrl: true })
  public technicalSpecification: AttachmentContract | null

  @attachment({ preComputeUrl: true })
  public photoOne: AttachmentContract | null

  @attachment({ preComputeUrl: true })
  public photoTwo: AttachmentContract | null

  @attachment({ preComputeUrl: true })
  public photoThree: AttachmentContract | null

  @attachment({ preComputeUrl: true })
  public photoFour: AttachmentContract | null

  @attachment({ preComputeUrl: true })
  public photoFive: AttachmentContract | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
