import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProjectMembership from 'App/Models/ProjectMembership'
import Profile from 'App/Models/Profile'
import Project from 'App/Models/Project'
import { DateTime } from 'luxon'
import PaginationValidator from 'App/Validators/PaginationValidator'
import ProfileOrganizationActionValidator from 'App/Validators/ProfileOrganizationActionValidator'

export default class ProjectMembershipsController {
  @bind()
  public async index({ request }: HttpContextContract, project: Project) {
    const payload = await request.validate(PaginationValidator)

    return await project
      .related('projectMemberships')
      .query()
      .paginate(payload.page, payload.perPage)
  }

  @bind()
  public async store({ request, bouncer }: HttpContextContract, project: Project) {
    const payload = await request.validate(ProfileOrganizationActionValidator)

    const profile = await Profile.findOrFail(payload.profileId)

    await bouncer.with('MembershipPolicy').authorize('create', project)

    const { message } = await request.validate({
      schema: schema.create({
        message: schema.string({ trim: true }, [rules.minLength(1), rules.maxLength(255)]),
      }),
    })

    const membership = await project
      .related('projectMemberships')
      .create({ profileId: profile.id, type: 'member', message })

    return { data: membership }
  }

  @bind()
  public async update(
    { bouncer }: HttpContextContract,
    project: Project,
    membership: ProjectMembership
  ) {
    await bouncer.with('MembershipPolicy').authorize('update', project, membership)

    membership.merge({ acceptedAt: DateTime.now() })

    await membership.save()

    return { data: membership }
  }

  @bind()
  public async destroy(
    { bouncer }: HttpContextContract,
    project: Project,
    membership: ProjectMembership
  ) {
    await bouncer.with('MembershipPolicy').authorize('delete', project, membership)

    await membership.delete()
  }
}
