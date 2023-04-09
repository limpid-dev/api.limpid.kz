import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import File from 'App/Models/File'
import Project from 'App/Models/Project'

export default class ProjectFilePolicy extends BasePolicy {
  public async create(user: User, project: Project) {
    const exists = await user.related('projects').query().where('id', project.id)

    return !!exists
  }
  public async delete(user: User, project: Project, file: File) {
    const exists = await user
      .related('files')
      .query()
      .where('id', file.id)
      .andWhere('projectId', project.id)

    return !!exists
  }
}
