import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import ProjectFile from 'App/Models/ProjectFile'
import Project from 'App/Models/Project'
import Profile from 'App/Models/Profile'

export default class ProjectFilePolicy extends BasePolicy {
  public async viewList(user: User) {
    if (!user.verifiedAt) {
      return false
    }

    return true
  }
  public async view(user: User) {
    if (!user.verifiedAt) {
      return false
    }

    return true
  }
  public async create(user: User, profile: Profile, project: Project) {
    if (!user.verifiedAt) {
      return false
    }

    if (user.id !== profile.userId) {
      return false
    }

    return profile.id === project.profileId
  }
  public async delete(user: User, profile: Profile, project: Project, projectFile: ProjectFile) {
    if (!user.verifiedAt) {
      return false
    }

    if (user.id !== profile.userId) {
      return false
    }

    if (profile.id !== project.profileId) {
      return false
    }

    return project.id === projectFile.projectId
  }
}
