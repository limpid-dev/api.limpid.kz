import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import AppBaseModel from './AppBaseModel'
import User from './User'

export default class Notification extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public readAt: DateTime | null

  @column()
  public title: string

  @column()
  public body: string

  @column({
    prepare: (value: unknown) => JSON.stringify(value),
    consume: (value: unknown) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  public data: Record<string, unknown>

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  public async read(this: Notification) {
    await this.merge({ readAt: DateTime.now() }).save()
  }

  public static async notify(
    user: User,
    title: string,
    body: string,
    data: Record<string, unknown> = {}
  ) {
    return await user.related('notifications').create({
      title,
      body,
      data,
    })
  }
}
