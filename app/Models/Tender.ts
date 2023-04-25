import { BelongsTo, HasMany, belongsTo, column, computed, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import AppBaseModel from './AppBaseModel'
import File from './File'
import Profile from './Profile'
import TenderBid from './TenderBid'

export default class Tender extends AppBaseModel {
  public static search = ['title', 'description']

  @column({ isPrimary: true })
  public id: number

  @column()
  public profileId: number

  @belongsTo(() => Profile)
  public profile: BelongsTo<typeof Profile>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => File)
  public files: HasMany<typeof File>

  @column()
  public title: string

  @column()
  public description: string

  @column.dateTime()
  public verifiedAt: DateTime | null

  // Duration in hours
  @column()
  public duration: number

  @computed()
  public get finishedAt() {
    if (this.verifiedAt) {
      return this.verifiedAt.plus({ hours: this.duration })
    }

    return null
  }

  @computed()
  public get isVerified() {
    return !!this.verifiedAt
  }

  @column()
  public startingPrice: number | null

  @hasMany(() => TenderBid)
  public bids: HasMany<typeof TenderBid>
}
