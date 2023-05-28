import { ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'
import User from './User'

export default class Organization extends Profile {
  @column()
  public performance: string

  @column()
  public legalStructure: string

  @manyToMany(() => User, {
    pivotTable: 'profile_user',
    pivotTimestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  })
  public members: ManyToMany<typeof User>
}
