import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'
import Experience from 'App/Models/Experience'

export default class ExperiencePolicy extends BasePolicy {
  public async create(user: User, profile: Profile) {
    const exists = await user.related('profiles').query().where('id', profile.id).first()

    return !!exists
  }
  public async update(user: User, experience: Experience) {
    const exists = await user.related('experiences').query().where('id', experience.id).first()

    return !!exists
  }
  public async delete(user: User, experience: Experience) {
    const exists = await user.related('experiences').query().where('id', experience.id).first()

    return !!exists
  }
}
