import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'
import ProfileMember from 'App/Models/ProfileMember'

export default class MembersPolicy extends BasePolicy {
  public async viewList(user: User, organization: Profile) {
    return user.id === organization.userId
  }
  public async create(user: User, organization: Profile) {
    return (
      user.id !== organization.userId &&
      !user.related('profileMemberships').query().where('profileId', organization.id).first()
    )
  }
  public async update(user: User, organization: Profile, member: ProfileMember) {
    return user.id === organization.userId && member.status === 'pending'
  }
  public async delete(user: User, organization: Profile, member: ProfileMember) {
    return user.id === organization.userId && member.status === 'accepted'
  }
}
