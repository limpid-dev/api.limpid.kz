import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Contact from './Contact'
import Resource from './Resource'
import User from './User'
import { AttachmentContract, attachment } from '@ioc:Adonis/Addons/AttachmentLite'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @attachment()
  public avatar: AttachmentContract | null

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public location: string | null

  @column()
  public industry: string

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => Resource)
  public resources: HasMany<typeof Resource>

  @hasMany(() => Contact)
  public contacts: HasMany<typeof Contact>
}
