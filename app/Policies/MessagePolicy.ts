import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Profile from 'App/Models/Profile'
import Project from 'App/Models/Project'
import User from 'App/Models/User'

export default class MessagePolicy extends BasePolicy {
  public async viewList(_user: User, profile: Profile, project: Project) {
    const isMember = !!(await profile
      .related('memberships')
      .query()
      .where('projectId', project.id)
      .first())

    const isAdmin = !!(await profile.related('projects').query().where('id', project.id).first())

    return isMember || isAdmin
  }

  public async create(_user: User, profile: Profile, project: Project) {
    const isMember = !!(await profile
      .related('memberships')
      .query()
      .whereNotNull('acceptedAt')
      .andWhere('projectId', project.id)
      .first())

    const isAdmin = !!(await profile.related('projects').query().where('id', project.id).first())

    return isMember || isAdmin
  }
}
