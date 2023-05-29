import { string } from '@ioc:Adonis/Core/Helpers'
import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

type Type = 'API' | 'EMAIL_VERIFICATION' | 'PASSWORD_RECOVERY'

export const typeToName: Record<Type, string> = {
  EMAIL_VERIFICATION: 'Email Verification Token',
  PASSWORD_RECOVERY: 'Password Recovery Token',
  API: 'Opaque Access Token',
}

export default class ApiToken extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public name: string

  @column()
  public type: Type

  @column()
  public token: string

  @column.dateTime()
  public expiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  public static async generate(
    user: User,
    {
      type,
      size,
      expiresAt,
    }: {
      type: Type
      size: number
      expiresAt: DateTime
    }
  ) {
    await user.related('apiTokens').query().where('type', type).delete()

    const token = string.generateRandom(size)

    const apiToken = await user.related('apiTokens').create({
      token,
      name: typeToName[type],
      type,
      expiresAt,
    })

    return apiToken.token
  }

  public static async isValid(token: string, type: Type) {
    const apiToken = await ApiToken.query()
      .where('type', type)
      .andWhere('token', token)
      .andWhere('expiresAt', '>', DateTime.now().toSQL()!)
      .first()

    return apiToken ?? null
  }
}
