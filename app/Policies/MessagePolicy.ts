import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Profile from 'App/Models/Profile'
import Project from 'App/Models/Project'
import User from 'App/Models/User'

export default class MessagePolicy extends BasePolicy {
  public async viewList(user: User, project: Project) {
    const member = await user.related('projectMemberships').query().where('projectId', project.id).first()

    return !!member
  }

  public async create(user: User, profile: Profile, project: Project) {
    const member = await user.related('projectMemberships').query().where('projectId', project.id).first()

    return !!member && user.id === profile.userId
  }
}
