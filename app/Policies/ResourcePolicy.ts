import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Resource from 'App/Models/Resource'

export default class ResourcePolicy extends BasePolicy {
  public async create(user: User, resource: Resource) {
    const exists = await user.related('resources').query().where('id', resource.id).first()

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
