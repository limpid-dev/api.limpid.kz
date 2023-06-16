import type { EventsList } from '@ioc:Adonis/Core/Event'
import Notification from 'App/Models/Notification'

export default class Project {
  public async onNewMember([project, projectMember]: EventsList['project:new-member']) {
    await project.load('profile')
    await project.profile.load('user')
    await projectMember.load('profile')

    await Notification.create({
      title: 'Новая заявкая на участие в проекте',
      description: `${projectMember.profile.displayName} хочет присоединиться к проекту ${project.title}`,
      type: 'PROJECT-NEW-MEMBER',
      meta: {
        project_id: project.id,
      },
      userId: project.profile.user.id,
    })
  }
}
