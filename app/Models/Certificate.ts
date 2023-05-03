import { BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import AppBaseModel from './AppBaseModel'
import File from './File'
import Profile from './Profile'
import Organization from './Organization'

export default class Certificate extends AppBaseModel {
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

  @hasMany(() => File)
  public files: HasMany<typeof File>
}
