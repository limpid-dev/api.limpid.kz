import Hash from '@ioc:Adonis/Core/Hash'
import {
  BaseModel,
  HasMany,
  HasManyThrough,
  beforeSave,
  column,
  hasMany,
  hasManyThrough,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Profile from './Profile'
import Project from './Project'
import Membership from './Membership'
import Contact from './Contact'
import Certificate from './Certificate'
import Education from './Education'
import Experience from './Experience'
import File from './File'
import Message from './Message'
import Resource from './Resource'
import Skill from './Skill'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public verifiedAt: DateTime | null

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public rememberMeToken: string | null

  @column()
  public firstName: string

  @column()
  public lastName: string

  @hasMany(() => Profile)
  public profiles: HasMany<typeof Profile>

  @hasManyThrough([() => Contact, () => Profile])
  public contacts: HasManyThrough<typeof Contact>

  @hasManyThrough([() => Skill, () => Profile])
  public skills: HasManyThrough<typeof Skill>

  @hasManyThrough([() => Membership, () => Profile])
  public memberships: HasManyThrough<typeof Membership>

  @hasManyThrough([() => Resource, () => Profile])
  public resources: HasManyThrough<typeof Resource>

  @hasManyThrough([() => Education, () => Profile])
  public educations: HasManyThrough<typeof Education>

  @hasManyThrough([() => Certificate, () => Profile])
  public certificates: HasManyThrough<typeof Certificate>

  @hasManyThrough([() => Experience, () => Profile])
  public experiences: HasManyThrough<typeof Experience>

  @hasManyThrough([() => Project, () => Profile])
  public projects: HasManyThrough<typeof Project>

  @hasManyThrough([() => Message, () => Profile])
  public messages: HasManyThrough<typeof Message>

  @hasManyThrough([() => File, () => Profile])
  public files: HasManyThrough<typeof File>

  @beforeSave()
  public static async beforeSave(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
    if (user.$dirty.email) {
      user.verifiedAt = null
    }
  }
}
