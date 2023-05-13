import { column, hasMany, HasMany, BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Invoice from './Invoice'

export default class SubPlans extends BaseModel {

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public name: string

  @column()
  public amount: number | null

  @column()
  public projects_atmpts: number
  
  @column()
  public auction_atmpts: number

  @column()
  public duration: number

  @hasMany(() => Invoice)
  public invoices: HasMany<typeof Invoice>
}
