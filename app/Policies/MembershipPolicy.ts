import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Membership from 'App/Models/Membership'
import Profile from 'App/Models/Profile'
import Project from 'App/Models/Project'

export default class MembershipPolicy extends BasePolicy {
  public async create(user: User, profile: Profile) {
    return user.id === profile.userId
  }
  public async update(user: User, profile: Profile, project: Project) {
    if (user.id !== profile.userId) {
      return false
    }

    return profile.id === project.profileId
  }
  public async delete(user: User, profile: Profile, project: Project, membership: Membership) {
    if (user.id !== profile.userId) {
      return false
    }

    if (project.id !== membership.projectId) {
      return false
    }

    return membership.profileId === profile.id
  }
}
