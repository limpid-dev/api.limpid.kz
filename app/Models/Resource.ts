import { DateTime } from 'luxon'
import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm'

export type Type = 'MATERIAL' | 'INTELLECTUAL'

export default class Resource extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public verifiedAt: DateTime | null

  @column()
  public type: Type

  @column()
  public title: string

  @column()
  public description: string

  @computed()
  public get isVerified() {
    return !!this.verifiedAt
  }
}
