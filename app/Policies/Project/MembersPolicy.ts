import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Project from 'App/Models/Project'
import ProjectMember from 'App/Models/ProjectMember'

export default class MembersPolicy extends BasePolicy {
  public async viewList(user: User, project: Project) {
    return user.selectedProfileId === project.profileId
  }
  public async create(user: User, project: Project) {
    return (
      user.selectedProfileId === project.profileId &&
      !project.related('members').query().where('profileId', user.id).first()
    )
  }
  public async update(user: User, project: Project, member: ProjectMember) {
    return user.selectedProfileId === project.profileId && member.status === 'pending'
  }
  public async delete(user: User, project: Project, member: ProjectMember) {
    return user.selectedProfileId === project.profileId && member.status === 'accepted'
  }
}
