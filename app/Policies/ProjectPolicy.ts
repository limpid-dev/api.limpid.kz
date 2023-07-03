import Bouncer, { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Project from 'App/Models/Project'
import { DateTime } from 'luxon'

export default class ProjectPolicy extends BasePolicy {
  public async create(user: User) {
    const now = DateTime.now()
    if ((now >= user.paymentStart && now <= user.paymentEnd) || user.paymentEnd === null) {
      if (user.projectsAttempts > 0) {
        return true
      }
      return Bouncer.deny('Number of attempts has ended', 402)
    }
    return Bouncer.deny('Tariff has expired', 402)
  }

  public async show(user: User, project: Project) {
    if (user.planId || user.selectedProfileId === project.profileId) {
      return true
    }
    return Bouncer.deny('You have no permission', 402)
  }

  public async update(user: User, project: Project) {
    return user.selectedProfileId === project.profileId
  }

  public async delete(user: User, project: Project) {
    return user.selectedProfileId === project.profileId
  }
}
