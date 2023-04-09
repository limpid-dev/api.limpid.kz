import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Resource from 'App/Models/Resource'
import Profile from 'App/Models/Profile'

export default class ResourcePolicy extends BasePolicy {
  public async create(user: User, profile: Profile) {
    const exists = await user.related('profiles').query().where('id', profile.id).first()

    return !!exists
  }
  public async update(user: User, resource: Resource) {
    const exists = await user.related('resources').query().where('id', resource.id).first()

    return !!exists
  }
  public async delete(user: User, resource: Resource) {
    const exists = await user.related('resources').query().where('id', resource.id).first()

    return !!exists
  }
}
