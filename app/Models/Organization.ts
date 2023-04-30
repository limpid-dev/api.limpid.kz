import { HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import AppBaseModel from './AppBaseModel'
import Contact from './Contact'
import File from './File'
import Certificate from './Certificate'
import OrganizationMembership from './OrganizationMembership'

export default class Organization extends AppBaseModel {
  public static search = [
    'name',
    'bin',
    'description',
    'industry',
    'ownedIntellectualResources',
    'ownedMaterialResources',
    'perfomance',
  ]

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

  @hasMany(() => Certificate)
  public certificates: HasMany<typeof Certificate>

  @hasMany(() => OrganizationMembership)
  public memberships: HasMany<typeof OrganizationMembership>
}
