import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Certificate from './Certificate'
import Project from './Project'
import Profile from './Profile'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public name: string

  @column()
  public size: number

  @column()
  public mimeType: string

  @column()
  public extname: string

  @column()
  public visibility: string

  @column()
  public location: string

  @column()
  public profileId: number

  @belongsTo(() => Profile)
  public profile: BelongsTo<typeof Profile>

  @column()
  public certificateId: number | null

  @belongsTo(() => Certificate)
  public certificate: BelongsTo<typeof Certificate>

  @column()
  public projectId: number | null

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>
}
