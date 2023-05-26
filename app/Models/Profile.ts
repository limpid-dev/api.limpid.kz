import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

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
  public description: string | null

  @column()
  public location: string | null

  @column()
  public industry: string | null

  @column()
  public ownedIntellectualResources: string | null

  @column()
  public ownedMaterialResources: string | null

  @column()
  public bin: string | null

  @column()
  public perfomance: string | null

  @column()
  public type: string | null

  @column()
  public isVisible: boolean

  @column()
  public isPersonal: boolean

  @column.dateTime()
  public verifiedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
