import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  HasOne,
  belongsTo,
  column,
  hasMany,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'
import ProjectMember from './ProjectMember'
import Chat from './Chat'
import { AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public profileId: number

  @belongsTo(() => Profile)
  public profile: BelongsTo<typeof Profile>

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public location: string

  @column()
  public industry: string

  @column()
  public stage: string

  @column()
  public requiredMoneyAmount: number

  @column()
  public ownedMoneyAmount: number

  @column()
  public requiredIntellectualResources: string

  @column()
  public ownedIntellectualResources: string

  @column()
  public requiredMaterialResources: string

  @column()
  public ownedMaterialResources: string

  @column()
  public profitability: string

  @column()
  public logo: AttachmentContract | null

  @column()
  public videoIntroduction: AttachmentContract | null

  @column()
  public presentation: AttachmentContract | null

  @column()
  public businessPlan: AttachmentContract | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public chatId: number

  @hasOne(() => Chat)
  public chat: HasOne<typeof Chat>

  @hasMany(() => ProjectMember)
  public members: HasMany<typeof ProjectMember>
}
