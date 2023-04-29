import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import AppBaseModel from './AppBaseModel'
import Profile from './Profile'
import Tender from './Tender'

export default class TenderBid extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public wonAt: DateTime | null

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
}
