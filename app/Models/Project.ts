import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import File from './File'
import ProjectMembership from './ProjectMembership'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

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

  @hasMany(() => ProjectMembership)
  public projectMemberships: HasMany<typeof ProjectMembership>

  @hasMany(() => File)
  public files: HasMany<typeof File>
}
