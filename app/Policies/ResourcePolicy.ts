import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Resource from 'App/Models/Resource'
import Profile from 'App/Models/Profile'

export default class ResourcePolicy extends BasePolicy {
  public async create(user: User, profile: Profile) {
    return user.id === profile.userId
  }
  public async update(user: User, profile: Profile, resource: Resource) {
    return user.id === profile.userId && resource.profileId === profile.id
  }
  public async delete(user: User, profile: Profile, resource: Resource) {
    return user.id === profile.userId && resource.profileId === profile.id
  }
}
