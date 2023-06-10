import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  HasOne,
  ModelQueryBuilderContract,
  beforeFetch,
  beforeFind,
  beforePaginate,
  belongsTo,
  column,
  hasMany,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'
import ProjectMember from './ProjectMember'
import Chat from './Chat'
import { AttachmentContract, attachment } from '@ioc:Adonis/Addons/AttachmentLite'

type ProjectQuery = ModelQueryBuilderContract<typeof Project>

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

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime | null

  public async softDelete() {
    this.deletedAt = DateTime.now()
    await this.save()
  }

  @beforeFetch()
  public static fetchWithoutSoftDeletes(query: ProjectQuery) {
    query.whereNull('deleted_at')
  }

  @beforeFind()
  public static findWithoutSoftDeletes(query: ProjectQuery) {
    query.whereNull('deleted_at')
  }

  @beforePaginate()
  public static paginateWithoutSoftDeletes([countQuery, query]: [
    ProjectQuery,
    ProjectQuery
  ]): void {
    countQuery.whereNull('deleted_at')
    query.whereNull('deleted_at')
  }
}
