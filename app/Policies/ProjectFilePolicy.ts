import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import File from 'App/Models/File'
import Project from 'App/Models/Project'

export default class ProjectFilePolicy extends BasePolicy {
  public async create(user: User, project: Project) {
    const profile = await user.related('profiles').query().where('id', project.profileId).first()

    return !!profile
  }
  public async delete(user: User, project: Project, file: File) {
    const profile = await user.related('profiles').query().where('id', project.profileId).first()

    return !!profile && file.projectId === project.id
  }
}
