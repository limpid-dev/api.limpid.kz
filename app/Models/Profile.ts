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
import Certificate from './Certificate'
import Contact from './Contact'
import Education from './Education'
import Experience from './Experience'
import Membership from './Membership'
import Resource from './Resource'
import Skill from './Skill'
import User from './User'
import Project from './Project'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public verifiedAt: DateTime | null

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public location: string | null

  @column()
  public industry: string

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => Contact)
  public contacts: HasMany<typeof Contact>

  @hasMany(() => Skill)
  public skills: HasMany<typeof Skill>

  @hasMany(() => Membership)
  public memberships: HasMany<typeof Membership>

  @hasMany(() => Resource)
  public resources: HasMany<typeof Resource>

  @hasMany(() => Education)
  public educations: HasMany<typeof Education>

  @hasMany(() => Certificate)
  public certificates: HasMany<typeof Certificate>

  @hasMany(() => Experience)
  public experiences: HasMany<typeof Experience>

  @hasMany(() => Project)
  public projects: HasMany<typeof Project>

  @beforeSave()
  public static async beforeSave(profile: Profile) {
    if (profile.$isDirty) {
      profile.verifiedAt = null
    }
  }
}
