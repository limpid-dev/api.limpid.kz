import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Skill from 'App/Models/Skill'
import Profile from 'App/Models/Profile'

export default class SkillPolicy extends BasePolicy {
  public async create(user: User, profile: Profile) {
    const exists = await user.related('profiles').query().where('id', profile.id).first()

    return !!exists
  }
  public async update(user: User, skill: Skill) {
    const exists = await user.related('skills').query().where('id', skill.id).first()

    return !!exists
  }
  public async delete(user: User, skill: Skill) {
    const exists = await user.related('skills').query().where('id', skill.id).first()

    return !!exists
  }
}
