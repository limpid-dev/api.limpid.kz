import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Project from 'App/Models/Project'
import Profile from 'App/Models/Profile'

export default class ProjectPolicy extends BasePolicy {
  public async create(user: User, profile: Profile) {
    const exists = await user.related('profiles').query().where('id', profile.id).first()

    return !!exists
  }
  public async update(user: User, project: Project) {
    const exists = await user.related('projects').query().where('id', project.id).first()

    return !!exists
  }
  public async delete(user: User, project: Project) {
    const exists = await user.related('projects').query().where('id', project.id).first()

    return !!exists
  }
}
