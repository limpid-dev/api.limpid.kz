import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Profile from './Profile'
import Organization from './Organization'

export type Type = 'EMAIL' | 'MOBILE' | 'URL'

export default class Contact extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public type: Type

  @column()
  public name: string

  @column()
  public value: string

  @column()
  public profileId: number | null

  @belongsTo(() => Profile)
  public profile: BelongsTo<typeof Profile>

  @column()
  public organizationId: number | null

  @belongsTo(() => Organization)
  public organization: BelongsTo<typeof Organization>
}
