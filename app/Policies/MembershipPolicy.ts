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
    if (membership.projectId !== project.id) {
      return false
    }

    if (membership.type === 'member') {
      const m = await user
        .related('memberships')
        .query()
        .where('profileId', membership.profileId)
        .first()

      return m && m.id === membership.id
    }

    if (membership.type === 'owner') {
      const admin = await user.related('profiles').query().where('id', project.profileId).first()

      return !!admin
    }

    return false
  }
}
