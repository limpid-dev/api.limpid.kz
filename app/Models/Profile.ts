import { AttachmentContract, attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  beforeSave,
  belongsTo,
  column,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Project from './Project'
import Tender from './Tender'
import User from './User'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public displayName: string

  @column()
  public description: string | null

  @column()
  public location: string | null

  @column()
  public industry: string | null

  @column()
  public ownedIntellectualResources: string | null

  @column()
  public ownedMaterialResources: string | null

  @column()
  public tin: string | null

  @column()
  public isVisible: boolean

  @column({
    serializeAs: null,
  })
  public isPersonal: boolean

  @column.dateTime()
  public tinVerifiedAt: DateTime | null

  @attachment({ preComputeUrl: true })
  public avatar: AttachmentContract | null

  @hasMany(() => Tender)
  public tenders: HasMany<typeof Tender>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Project)
  public projects: HasMany<typeof Project>

  @beforeSave()
  public static async unverifyBin(profile: Profile) {
    if (profile.$dirty.tin) {
      profile.tinVerifiedAt = null
    }
  }

  public static findForRequest(_ctx, param, value) {
    const lookupKey = param.lookupKey === '$primaryKey' ? 'id' : param.lookupKey

    return this.query()
      .where(lookupKey, value)
      .if(param.name === 'profile', (query) => {
        query.where('isPersonal', true)
      })
      .if(param.name === 'organization', (query) => {
        query.where('isPersonal', false)
      })
      .firstOrFail()
  }
}
