import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Membership from 'App/Models/Membership'
import Project from 'App/Models/Project'

export default class MembershipPolicy extends BasePolicy {
  public async create(user: User, project: Project) {
    const admin = await user.related('profiles').query().where('id', project.profileId).first()

    const membership = await user
      .related('memberships')
      .query()
      .where('projectId', project.id)
      .first()

    return !admin && !membership
  }
  public async update(user: User, project: Project, membership: Membership) {
    const admin = await user.related('profiles').query().where('id', project.profileId).first()

    return !!admin && membership.projectId === project.id
  }
  public async delete(user: User, project: Project, membership: Membership) {
    const admin = await user.related('profiles').query().where('id', project.profileId).first()

    const isMember = await user
      .related('memberships')
      .query()
      .where('id', membership.id)
      .andWhere('projectId', project.id)
      .first()

    return membership.projectId === project.id && (!!admin || !!isMember)
  }
}
