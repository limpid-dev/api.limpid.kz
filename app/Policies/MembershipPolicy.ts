import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Membership from 'App/Models/Membership'
import Profile from 'App/Models/Profile'
import Project from 'App/Models/Project'

export default class MembershipPolicy extends BasePolicy {
  public async create(user: User, profile: Profile) {
    const exists = await user.related('profiles').query().where('id', profile.id).first()

    return !!exists
  }
  public async update(user: User, project: Project, membership: Membership) {
    const admin = await user.related('projects').query().where('id', project.id).first()

    const member = await user.related('memberships').query().where('id', membership.id).first()

    return !!admin || !!member
  }
  public async delete(user: User, project: Project, membership: Membership) {
    const admin = await user.related('projects').query().where('id', project.id).first()

    const member = await user.related('memberships').query().where('id', membership.id).first()

    return !!admin || !!member
  }
}
