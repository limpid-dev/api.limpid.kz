import { compose } from '@ioc:Adonis/Core/Helpers'
import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Membership from './Membership'
import Project from './Project'
import { Searchable } from 'App/Mixins/Searchable'

export default class Message extends compose(BaseModel, Searchable) {
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

  @belongsTo(() => Membership)
  public membership: BelongsTo<typeof Membership>
}
