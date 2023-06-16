import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import Project from './Project'
import Profile from './Profile'

export default class ProjectMember extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public applicationMessage: string

  @column()
  public rejectionMessage: string | null

  @column()
  public projectId: number

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

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
