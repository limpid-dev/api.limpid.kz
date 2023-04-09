import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Project from 'App/Models/Project'
import Profile from 'App/Models/Profile'

export default class ProjectPolicy extends BasePolicy {
  public async create(user: User, profile: Profile) {
    return user.id === profile.userId
  }
  public async update(user: User, profile: Profile, project: Project) {
    return profile.id === project.profileId
  }
  public async delete(user: User, profile: Profile, project: Project) {
    return profile.id === project.profileId
  }
}
