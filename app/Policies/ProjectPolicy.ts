import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Project from 'App/Models/Project'

export default class ProjectPolicy extends BasePolicy {
  public async update(user: User, project: Project) {
    return user.selectedProfileId === project.profileId
  }
  public async delete(user: User, project: Project) {
    return user.selectedProfileId === project.profileId
  }
}
