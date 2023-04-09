import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Project from 'App/Models/Project'
import User from 'App/Models/User'

export default class MessagePolicy extends BasePolicy {
  public async viewList(user: User, project: Project) {
    const admin = await user.related('projects').query().where('id', project.id).first()

    const membership = await user
      .related('memberships')
      .query()
      .where('projectId', project.id)
      .first()

    return !!membership?.acceptedAt || !!admin
  }

  public async create(user: User, project: Project) {
    const admin = await user.related('projects').query().where('id', project.id).first()

    const membership = await user
      .related('memberships')
      .query()
      .where('projectId', project.id)
      .first()

    return !!membership?.acceptedAt || !!admin
  }
}
