import { cuid } from '@ioc:Adonis/Core/Helpers'
import Drive from '@ioc:Adonis/Core/Drive'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'
import Certificate from './Certificate'
import Project from './Project'

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
  public certificateId: number | null

  @belongsTo(() => Certificate)
  public certificate: BelongsTo<typeof Certificate>

  @column()
  public projectId: number | null

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>
}
