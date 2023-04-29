import { compose } from '@ioc:Adonis/Core/Helpers'
import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import ProjectMembership from './ProjectMembership'
import Project from './Project'
import { Searchable } from 'App/Mixins/Searchable'
import AppBaseModel from './AppBaseModel'

export default class Message extends compose(AppBaseModel, Searchable) {
  public static search = ['content']

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public content: string

  @column()
  public projectId: number

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @column()
  public membershipId: number

  @belongsTo(() => ProjectMembership)
  public membership: BelongsTo<typeof ProjectMembership>
}
