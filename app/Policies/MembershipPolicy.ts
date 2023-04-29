import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Membership from 'App/Models/Membership'
import Project from 'App/Models/Project'

export default class MembershipPolicy extends BasePolicy {
  public async create(user: User, project: Project) {
    const membership = await user
      .related('memberships')
      .query()
      .where('projectId', project.id)
      .first()

    return !membership
  }
  public async update(user: User, project: Project, membership: Membership) {
    const owner = await user
      .related('memberships')
      .query()
      .where('projectId', project.id)
      .andWhere('type', 'owner')
      .first()

    return owner && !membership.acceptedAt && membership.projectId === project.id
  }
  public async delete(user: User, project: Project, membership: Membership) {
    const userMembership = await user
      .related('memberships')
      .query()
      .where('projectId', project.id)
      .first()

    return (
      userMembership &&
      membership.projectId === project.id &&
      (userMembership.type === 'owner' || userMembership.id === membership.id)
    )
  }
}
