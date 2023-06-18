import { BelongsTo, belongsTo, column, BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import SubPlans from './SubPlans'
import User from './User'

export default class Invoice extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public userId: number

  @belongsTo(() => User)
  public users: BelongsTo<typeof User>

  @column()
  public planId: number

  @belongsTo(() => SubPlans)
  public plans: BelongsTo<typeof SubPlans>

  @column()
  public amount: number

  @column()
  public currency: string

  @column()
  public description: string

  @column()
  public postLink: string

  @column()
  public language: string

  @column()
  public terminal: string

  @column()
  public status: string

  @column()
  public payId: string

  @column()
  public cancelToken: string
  
  @column()
  public checkUrl: string

  @column()
  public invoiceId: number
}
