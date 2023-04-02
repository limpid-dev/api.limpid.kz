import { string } from '@ioc:Adonis/Core/Helpers'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import User from './User'

export type Type = 'RECOVERY' | 'VERIFICATION'

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: Type

  @column()
  public token: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public expiresAt: DateTime

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  public static async generate(user: User, type: Type) {
    const token = string.generateRandom(64)

    const record = await user.related('tokens').create({
      expiresAt: DateTime.now().plus({ hours: 1 }),
      type,
      token,
    })

    return record.token
  }

  public static async verify(token: string, type: Type) {
    const record = await Token.query()
      .where('token', token)
      .andWhere('type', type)
      .andWhere('expiresAt', '>', DateTime.now().toSQL())
      .first()

    return !!record
  }

  public static async expire(user: User, type: Type) {
    await user
      .related('tokens')
      .query()
      .where('type', type)
      .update({ expiresAt: DateTime.now().toSQL() })
  }
}
