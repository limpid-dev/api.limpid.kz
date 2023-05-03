import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Organization from './Organization'
import User from './User'
import AppBaseModel from './AppBaseModel'

export type Type = 'owner' | 'member'

export default class OrganizationMembership extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public type: Type

  @column()
  public organizationId: number

  @belongsTo(() => Organization)
  public organization: BelongsTo<typeof Organization>

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
