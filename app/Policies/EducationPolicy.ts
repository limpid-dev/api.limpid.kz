import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'
import Education from 'App/Models/Education'

export default class EducationPolicy extends BasePolicy {
  public async create(user: User, profile: Profile) {
    const exists = await user.related('profiles').query().where('id', profile.id).first()

    return !!exists
  }
  public async update(user: User, education: Education) {
    const exists = await user.related('educations').query().where('id', education.id).first()

    return !!exists
  }
  public async delete(user: User, education: Education) {
    const exists = await user.related('educations').query().where('id', education.id).first()

    return !!exists
  }
}
