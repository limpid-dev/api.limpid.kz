import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import File from './File'
import Contact from './Contact'

export default class Organization extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public name: string

  @column()
  public bin: string

  @column()
  public description: string

  @column()
  public industry: string

  @column()
  public ownedIntellectualResources: string

  @column()
  public ownedMaterialResources: string

  @column()
  public perfomance: string

  @hasMany(() => File)
  public files: HasMany<typeof File>

  @hasMany(() => Contact)
  public contacts: HasMany<typeof Contact>
}
