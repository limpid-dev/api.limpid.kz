import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'
import ProfileMember from './ProfileMember'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public displayName: string

  @column()
  public description: string

  @column()
  public location: string

  @column()
  public industry: string

  @column()
  public ownedIntellectualResources: string | null

  @column()
  public ownedMaterialResources: string | null

  @column()
  public tin: string

  @column()
  public performance: string | null

  @column()
  public legalStructure: string | null

  @column()
  public isVisible: boolean

  @column()
  public isPersonal: boolean

  @attachment({ preComputeUrl: true })
  public avatar: AttachmentContract | null

  @column.dateTime()
  public tinVerifiedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => ProfileMember)
  public members: HasMany<typeof ProfileMember>
}
