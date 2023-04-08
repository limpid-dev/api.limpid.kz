import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany, computed } from '@ioc:Adonis/Lucid/Orm'
import Token from './Token'
import { AttachmentContract, attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Profile from './Profile'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public rememberMeToken: string | null

  @attachment({
    preComputeUrl: true,
  })
  public avatar: AttachmentContract | null

  @column()
  public firstName: string

  @column()
  public lastName: string

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

  @hasMany(() => Token)
  public tokens: HasMany<typeof Token>

  @hasMany(() => Profile)
  public profiles: HasMany<typeof Profile>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeSave()
  public static async resetVerifiedAt(user: User) {
    if (user.$dirty.email) {
      user.verifiedAt = null
    }
  }
}
