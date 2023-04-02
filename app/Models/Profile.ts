import {
  BaseModel,
  BelongsTo,
  ModelQueryBuilderContract,
  beforeFetch,
  belongsTo,
  column,
  computed,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import User from './User'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public verifiedAt: DateTime | null

  @computed()
  public get isVerified() {
    return !!this.verifiedAt
  }

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public location: string | null

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @beforeFetch()
  public static fetchOnlyVerified(query: ModelQueryBuilderContract<typeof Profile>) {
    query.whereNotNull('verified_at')
  }
}
