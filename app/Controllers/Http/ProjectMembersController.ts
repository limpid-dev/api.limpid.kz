import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'
import ProjectMember from 'App/Models/ProjectMember'
import PaginationValidator from 'App/Validators/PaginationValidator'
import RejectValidator from 'App/Validators/Projects/Members/RejectValidator'
import StoreValidator from 'App/Validators/Projects/Members/StoreValidator'
import { DateTime } from 'luxon'
import Event from '@ioc:Adonis/Core/Event'

export default class ProjectMembersController {
  @bind()
  public async showMembership({ auth }: HttpContextContract, project: Project) {
    const member = await ProjectMember.query()
      .where('profileId', auth.user!.selectedProfileId!)
      .where('projectId', project.id)
      .firstOrFail()

    return {
      data: member,
    }
  }

  @bind()
  public async index({ request, bouncer }: HttpContextContract, project: Project) {
    await bouncer.with('ProjectMembersPolicy').authorize('viewList', project)

    const { page, per_page: perPage } = await request.validate(PaginationValidator)

    return project.related('members').query().preload('profile').paginate(page, perPage)
  }

  @bind()
  public async store({ request, bouncer, auth }: HttpContextContract, project: Project) {
    await bouncer.with('ProjectMembersPolicy').authorize('create', project)
    const { application_message: applicationMessage } = await request.validate(StoreValidator)

    const membership = await ProjectMember.create({
      applicationMessage,
      profileId: auth.user!.selectedProfileId!,
      projectId: project.id,
    })

    await Event.emit('project:new-member', [project, membership])

    return {
      data: membership,
    }
  }

  @bind()
  public async accept({ bouncer }: HttpContextContract, project: Project, member: ProjectMember) {
    await bouncer.with('ProjectMembersPolicy').authorize('update', project, member)

    member.merge({
      acceptedAt: DateTime.now(),
    })

    await member.save()

    const chat = await project.related('chat').query().firstOrFail()

    await member.load('profile')

    await member.profile.load('user')

    await chat.related('members').create({
      userId: member.profile.user.id,
    })

    return {
      data: member,
    }
  }

  @bind()
  public async reject(
    { request, bouncer }: HttpContextContract,
    project: Project,
    member: ProjectMember
  ) {
    await bouncer.with('ProjectMembersPolicy').authorize('update', project, member)

    const { rejection_message: rejectionMessage } = await request.validate(RejectValidator)

    member.merge({
      rejectedAt: DateTime.now(),
      rejectionMessage,
    })

    await member.save()

    return {
      data: member,
    }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, project: Project, member: ProjectMember) {
    await bouncer.with('ProjectMembersPolicy').authorize('delete', project, member)

    await member.delete()
  }
}
