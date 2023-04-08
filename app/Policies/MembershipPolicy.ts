import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Membership from 'App/Models/Membership'
import Profile from 'App/Models/Profile'
import Project from 'App/Models/Project'

export default class MembershipPolicy extends BasePolicy {
  public async viewList(user: User, profile: Profile, project: Project) {
    if (!user.verifiedAt || !profile.verifiedAt) {
      return false
    }

    if (user.id !== profile.userId) {
      return false
    }

    return profile.id === project.profileId
  }

  public async view(user: User, profile: Profile, project: Project, membership: Membership) {
    if (!user.verifiedAt || !profile.verifiedAt) {
      return false
    }

    if (user.id !== profile.userId) {
      return false
    }

    if (project.profileId === profile.id) {
      return true
    }

    return membership.profileId === profile.id
  }
  public async create(user: User, profile: Profile) {
    if (!user.verifiedAt || !profile.verifiedAt) {
      return false
    }

    if (user.id !== profile.userId) {
      return false
    }

    return true
  }
  public async update(user: User, profile: Profile, project: Project) {
    if (!user.verifiedAt || !profile.verifiedAt) {
      return false
    }

    if (user.id !== profile.userId) {
      return false
    }

    return profile.id === project.profileId
  }
  public async delete(user: User, profile: Profile, project: Project, membership: Membership) {
    if (!user.verifiedAt || !profile.verifiedAt) {
      return false
    }

    if (user.id !== profile.userId) {
      return false
    }

    if (profile.id === project.profileId) {
      return true
    }

    return membership.profileId === profile.id
  }
}
