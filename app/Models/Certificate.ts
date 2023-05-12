import { BaseModel, BelongsTo, belongsTo, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import File from './File'
import Organization from './Organization'
import Profile from './Profile'

export default class Certificate extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public institution: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public issuedAt: DateTime

  @column.dateTime()
  public expiredAt: DateTime | null

  @column()
  public profileId: number | null

  @column()
  public organizationId: number | null

  @belongsTo(() => Organization)
  public organization: BelongsTo<typeof Organization>

  @belongsTo(() => Profile)
  public profile: BelongsTo<typeof Profile>

  public fileId: number

  @hasOne(() => File)
  public files: HasOne<typeof File>
}
