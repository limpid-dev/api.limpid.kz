import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Membership from 'App/Models/Membership'
import Profile from 'App/Models/Profile'
import Project from 'App/Models/Project'
import User from 'App/Models/User'

export default class MessagePolicy extends BasePolicy {
  public async viewList(user: User, profile: Profile, project: Project, membership: Membership) {
    if (user.id !== profile.userId) {
      return false
    }

    if (membership.profileId !== profile.id) {
      return false
    }

    if (membership.projectId !== project.id) {
      return false
    }

    if (!membership.acceptedAt) {
      return false
    }

    return true
  }

  public async create(user: User, profile: Profile, project: Project, membership: Membership) {
    if (user.id !== profile.userId) {
      return false
    }

    if (membership.profileId !== profile.id) {
      return false
    }

    if (membership.projectId !== project.id) {
      return false
    }

    if (!membership.acceptedAt) {
      return false
    }

    return true
  }
}
