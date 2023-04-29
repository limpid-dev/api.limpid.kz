import { compose } from '@ioc:Adonis/Core/Helpers'
import { HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { Searchable } from 'App/Mixins/Searchable'
import { DateTime } from 'luxon'
import AppBaseModel from './AppBaseModel'
import File from './File'
import ProjectMembership from './ProjectMembership'
import Message from './Message'

export default class Project extends compose(AppBaseModel, Searchable) {
  public static search = [
    'title',
    'description',
    'location',
    'industry',
    'stage',
    'requiredMoneyAmount',
    'ownedMoneyAmount',
    'requiredIntellectualResources',
    'ownedIntellectualResources',
    'requiredMaterialResources',
    'ownedMaterialResources',
    'profitability',
  ]

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

  @hasMany(() => Message)
  public messages: HasMany<typeof Message>
}
