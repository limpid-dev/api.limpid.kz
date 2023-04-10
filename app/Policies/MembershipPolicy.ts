import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Membership from 'App/Models/Membership'
import Profile from 'App/Models/Profile'
import Project from 'App/Models/Project'

export default class MembershipPolicy extends BasePolicy {
  public async create(user: User, project: Project) {
    return user.id === profile.userId && project.profileId !== profile.id
  }
  public async update(user: User, project: Project, membership: Membership) {
    return (
      user.id === profile.userId &&
      project.profileId === profile.id &&
      membership.projectId === project.id
    )
  }
  public async delete(user: User, project: Project, membership: Membership) {
    return (
      user.id === profile.userId &&
      membership.projectId === project.id &&
      (project.profileId === profile.id || membership.profileId === profile.id)
    )
  }
}
