import { DateTime, Duration } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasOne,
  belongsTo,
  column,
  computed,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import { duration } from 'App/Utilities/Duration'
import Profile from './Profile'
import TenderBid from './TenderBid'

export default class Tender extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public profileId: number

  @belongsTo(() => Profile)
  public profile: BelongsTo<typeof Profile>

  @column()
  public wonTenderBidId: number | null

  @hasOne(() => TenderBid)
  public wonTenderBid: HasOne<typeof TenderBid>

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public startingPrice: number | null

  @duration()
  public duration: Duration

  @column.dateTime()
  public verifiedAt: DateTime | null

  @computed()
  public get startedAt() {
    return this.verifiedAt
  }

  @computed()
  public get finishedAt() {
    return this.verifiedAt ? this.verifiedAt.plus(this.duration) : null
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
