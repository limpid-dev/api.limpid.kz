import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Project from 'App/Models/Project'
import Profile from 'App/Models/Profile'
import Organization from 'App/Models/Organization'

export default class ProjectPolicy extends BasePolicy {
  public async create(user: User, who: Profile | Organization) {
    if (who instanceof Profile) {
      return user.id === who.userId
    }

    if (who instanceof Organization) {
      const owner = who
        .related('memberships')
        .query()
        .where('type', 'owner')
        .andWhere('userId', user.id)
        .first()

      return !!owner
    }
  }

  public async update(user: User, project: Project) {
    const owner = await user
      .related('projectMemberships')
      .query()
      .where('projectId', project.id)
      .andWhere('type', 'owner')
      .first()

    return !!owner
  }
  public async delete(user: User, project: Project) {
    const owner = await user
      .related('projectMemberships')
      .query()
      .where('projectId', project.id)
      .andWhere('type', 'owner')
      .first()

    return !!owner
  }
}
