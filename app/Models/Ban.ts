import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Ban extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public expiredAt: DateTime | null

  @column()
  public description: string

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  public static async isBanned(user: User) {
    const record = await Ban.query()
      .where('userId', user.id)
      .andWhere('expiredAt', '>', DateTime.now().toSQL())
      .orWhereNull('expiredAt')
      .first()

    return record
  }
}
