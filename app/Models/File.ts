import { cuid } from '@ioc:Adonis/Core/Helpers'
import Drive from '@ioc:Adonis/Core/Drive'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public name: string

  @column()
  public size: number

  @column()
  public mimeType: string

  @column()
  public extname: string

  @column()
  public visibility: string

  @column()
  public profileId: number

  @computed()
  public get url() {
    const location = `./${this.profileId}/${this.name}`

    if (this.visibility === 'private') {
      return Drive.getSignedUrl(location, { expiresIn: '1h' })
    }

    return Drive.getUrl(location)
  }

  @belongsTo(() => Profile)
  public profile: BelongsTo<typeof Profile>

  public static async upload(
    profile: Profile,
    file: MultipartFileContract,
    visibility: 'public' | 'private'
  ) {
    const name = `${cuid()}.${file.extname}`

    const location = `./${profile.id}/${name}`
    const mimeType = `${file.type}/${file.subtype}`

    await file.moveToDisk(location, {
      name,
      visibility,
      contentType: mimeType,
      contentLength: file.size,
    })

    return await this.create({
      profileId: profile.id,
      visibility,
      name,
      size: file.size,
      extname: file.extname,
      mimeType,
    })
  }

  public static async download(profile: Profile, name: string) {
    const file = await this.query().where('profileId', profile.id).where('name', name).firstOrFail()

    const location = `./${profile.id}/${name}`

    if (file.visibility === 'private') {
      return await Drive.getSignedUrl(location, { expiresIn: '1h' })
    }

    return await Drive.getUrl(location)
  }
}
