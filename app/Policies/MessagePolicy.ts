import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Project from 'App/Models/Project'
import User from 'App/Models/User'

export default class MessagePolicy extends BasePolicy {
  public async viewList(user: User, project: Project) {
    const isMember = !!(await user
      .related('memberships')
      .query()
      .whereNotNull('acceptedAt')
      .andWhere('projectId', project.id)
      .first())

    const isAdmin = !!(await user.related('projects').query().where('id', project.id).first())

    return isMember || isAdmin
  }

  public async create(user: User, project: Project) {
    const isMember = !!(await user
      .related('memberships')
      .query()
      .whereNotNull('acceptedAt')
      .andWhere('projectId', project.id)
      .first())

    const isAdmin = !!(await user.related('projects').query().where('id', project.id).first())

    return isMember || isAdmin
  }
}
