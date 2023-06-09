import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Tender from './Tender'
import Profile from './Profile'

export default class TenderBid extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public tenderId: number

  @belongsTo(() => Tender)
  public tender: BelongsTo<typeof Tender>

  @column()
  public profileId: number

  @belongsTo(() => Profile)
  public profile: BelongsTo<typeof Profile>

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
