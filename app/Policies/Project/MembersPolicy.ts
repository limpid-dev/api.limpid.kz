import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Project from 'App/Models/Project'
import ProjectMember from 'App/Models/ProjectMember'

export default class MembersPolicy extends BasePolicy {
  public async viewList(_user: User, _project: Project) {
    // return user.selectedProfileId === project.profileId
    return true
  }
  public async create(user: User, project: Project) {
      if(user.selectedProfileId === project.profileId){
        return false
      }

      if(!!(await project.related('members').query().where('profileId', user.selectedProfileId!).first())){
        return false
      }

    return (
      true
    )
  }
  public async update(user: User, project: Project, member: ProjectMember) {
    return user.selectedProfileId === project.profileId && member.status === 'pending'
  }
  public async delete(user: User, project: Project, member: ProjectMember) {
    return user.selectedProfileId === project.profileId && member.status === 'accepted'
  }
}
