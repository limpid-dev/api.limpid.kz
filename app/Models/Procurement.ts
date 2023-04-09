import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import File from './File'
import Profile from './Profile'

export default class Procurement extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public startedAt: DateTime

  @column.dateTime()
  public finishedAt: DateTime

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public budget: number

  @hasMany(() => File)
  public files: HasMany<typeof File>

  @column()
  public profileId: number

  @belongsTo(() => Profile)
  public profile: BelongsTo<typeof Profile>
}
