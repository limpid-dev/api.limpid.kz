import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Project from 'App/Models/Project'
import Profile from 'App/Models/Profile'

export default class ProjectPolicy extends BasePolicy {
  public async create(user: User, profile: Profile) {
    if (user.id !== profile.userId) {
      return false
    }

    return !!user.verifiedAt && !!profile.verifiedAt
  }
  public async update(user: User, profile: Profile, project: Project) {
    if (user.id !== profile.userId) {
      return false
    }

    if (project.profileId !== profile.id) {
      return false
    }

    return !!user.verifiedAt && !!profile.verifiedAt
  }
  public async delete(user: User, profile: Profile, project: Project) {
    if (user.id !== profile.userId) {
      return false
    }

    if (project.profileId !== profile.id) {
      return false
    }

    return !!user.verifiedAt && !!profile.verifiedAt
  }
}
