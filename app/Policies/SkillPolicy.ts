import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Skill from 'App/Models/Skill'
import Profile from 'App/Models/Profile'

export default class SkillPolicy extends BasePolicy {
  public async create(user: User, profile: Profile) {
    return user.id === profile.userId
  }
  public async update(user: User, profile: Profile, skill: Skill) {
    return user.id === profile.userId && skill.profileId === profile.id
  }
  public async delete(user: User, profile: Profile, skill: Skill) {
    return user.id === profile.userId && skill.profileId === profile.id
  }
}
