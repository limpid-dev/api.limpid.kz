import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import File from 'App/Models/File'
import Project from 'App/Models/Project'

export default class ProjectFilePolicy extends BasePolicy {
  public async create(user: User, project: Project) {
    const owner = await user
      .related('projectMemberships')
      .query()
      .where('projectId', project.id)
      .andWhere('type', 'owner')
      .first()

    return !!owner
  }
  public async delete(user: User, project: Project, file: File) {
    const owner = await user
      .related('projectMemberships')
      .query()
      .where('projectId', project.id)
      .andWhere('type', 'owner')
      .first()

    return !!owner && file.projectId === project.id
  }
}
