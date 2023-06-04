import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Profile from './Profile'

export default class ProfileMember extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public applicationMessage: string

  @column()
  public rejectionMessage: string | null

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public profileId: number

  @belongsTo(() => Profile)
  public profile: BelongsTo<typeof Profile>

  @column.dateTime({ autoCreate: true })
  public appliedAt: DateTime

  @column.dateTime()
  public acceptedAt: DateTime | null

  @column.dateTime()
  public rejectedAt: DateTime | null

  @computed()
  public get status() {
    if (this.acceptedAt) {
      return 'accepted'
    }
    if (this.rejectedAt) {
      return 'rejected'
    }
    return 'pending'
  }
}
