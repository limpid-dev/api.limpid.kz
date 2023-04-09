import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Skill from 'App/Models/Skill'

export default class SkillPolicy extends BasePolicy {
  public async create(user: User, skill: Skill) {
    const exists = await user.related('skills').query().where('id', skill.id).first()

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
