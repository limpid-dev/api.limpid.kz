import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import File from 'App/Models/File'
import Project from 'App/Models/Project'
import Profile from 'App/Models/Profile'

export default class ProjectFilePolicy extends BasePolicy {
  public async create(user: User, profile: Profile, project: Project) {
    return user.id === profile.userId && project.profileId === profile.id
  }
  public async delete(user: User, profile: Profile, project: Project, file: File) {
    return (
      user.id === profile.userId &&
      project.profileId === profile.id &&
      file.projectId === project.id
    )
  }
}
