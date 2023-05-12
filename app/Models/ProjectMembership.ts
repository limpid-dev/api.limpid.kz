import { BelongsTo, HasMany, belongsTo, column, hasMany, BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Message from './Message'
import Profile from './Profile'
import Project from './Project'
import Organization from './Organization'

export type Type = 'owner' | 'member'

export default class ProjectMembership extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public acceptedAt: DateTime | null

  @column()
  public type: Type

  @column()
  public message: string | null

  @column()
  public profileId: number | null

  @column()
  public organizationId: number | null

  @belongsTo(() => Organization)
  public organization: BelongsTo<typeof Organization>

  @belongsTo(() => Profile)
  public profile: BelongsTo<typeof Profile>

  @column()
  public projectId: number

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @hasMany(() => Message)
  public messages: HasMany<typeof Message>
}
