import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Project from 'App/Models/Project'
import Profile from 'App/Models/Profile'
import File from 'App/Models/File'

export default class ProjectFilePolicy extends BasePolicy {
  public async create(user: User, profile: Profile, project: Project) {
    if (!user.verifiedAt) {
      return false
    }

    if (user.id !== profile.userId) {
      return false
    }

    return profile.id === project.profileId
  }
  public async delete(user: User, profile: Profile, project: Project, file: File) {
    if (!user.verifiedAt) {
      return false
    }

    if (user.id !== profile.userId) {
      return false
    }

    if (profile.id !== project.profileId) {
      return false
    }

    return project.id === file.projectId
  }
}
