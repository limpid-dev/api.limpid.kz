import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'

export default class Rating extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public rankingProfileId: number

  @column()
  public ratedProfileId: number

  @belongsTo(() => Profile)
  public rankingProfile: BelongsTo<typeof Profile>

  @belongsTo(() => Profile)
  public ratedProfile: BelongsTo<typeof Profile>

  @column()
  public comment: string

  @column()
  public cooperationType: string

  @column()
  public rankingRole: string

  @column()
  public ratedRole: string

  @column()
  public cooperationUrl: string

  @column()
  public ratingNumber: number | null

  @column.dateTime()
  public verifiedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
