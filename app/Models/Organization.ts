import { HasMany, column, hasMany, BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Contact from './Contact'
import File from './File'
import OrganizationMembership from './OrganizationMembership'
import Certificate from './Certificate'
import Experience from './Experience'
import ProjectMembership from './ProjectMembership'

export default class Organization extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public name: string

  @column()
  public bin: string

  @column()
  public description: string

  @column()
  public industry: string

  @column()
  public type: string

  @column()
  public ownedIntellectualResources: string

  @column()
  public ownedMaterialResources: string

  @column()
  public perfomance: string

  @hasMany(() => File)
  public files: HasMany<typeof File>

  @hasMany(() => Contact)
  public contacts: HasMany<typeof Contact>

  @hasMany(() => OrganizationMembership)
  public memberships: HasMany<typeof OrganizationMembership>

  @hasMany(() => Certificate)
  public certificates: HasMany<typeof Certificate>

  @hasMany(() => Experience)
  public experiences: HasMany<typeof Experience>

  @hasMany(() => ProjectMembership)
  public projectMemberships: HasMany<typeof ProjectMembership>
}
