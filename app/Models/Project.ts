import { AttachmentContract, attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  HasOne,
  beforeSave,
  belongsTo,
  column,
  hasMany,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Chat from './Chat'
import Profile from './Profile'
import ProjectMember from './ProjectMember'

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

  @attachment({
    preComputeUrl: true,
  })
  public logo: AttachmentContract | null

  @attachment({
    preComputeUrl: true,
  })
  public videoIntroduction: AttachmentContract | null

  @attachment({
    preComputeUrl: true,
  })
  public presentation: AttachmentContract | null

  @attachment({
    preComputeUrl: true,
  })
  public businessPlan: AttachmentContract | null

  @column.dateTime()
  public verifiedAt: DateTime | null

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

  @beforeSave()
  public static async unverify(project: Project) {
    if (project.$isDirty) {
      project.verifiedAt = null
    }
  }
}
