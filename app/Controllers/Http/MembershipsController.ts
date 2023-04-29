import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Membership from 'App/Models/Membership'
import Profile from 'App/Models/Profile'
import Project from 'App/Models/Project'
import { DateTime } from 'luxon'
import PaginationValidator from 'App/Validators/PaginationValidator'
import ProfileActionValidator from 'App/Validators/ProfileActionValidator'

export default class MembershipsController {
  @bind()
  public async index({ request }: HttpContextContract, project: Project) {
    const payload = await request.validate(PaginationValidator)

    return await project.related('memberships').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async store({ request, bouncer }: HttpContextContract, project: Project) {
    const payload = await request.validate(ProfileActionValidator)

    const profile = await Profile.findOrFail(payload.profileId)

    await bouncer.with('MembershipPolicy').authorize('create', project)

    const membership = await project
      .related('memberships')
      .create({ profileId: profile.id, type: 'member' })

    return { data: membership }
  }

  @bind()
  public async update({ bouncer }: HttpContextContract, project: Project, membership: Membership) {
    await bouncer.with('MembershipPolicy').authorize('update', project, membership)

    membership.merge({ acceptedAt: DateTime.now() })

    await membership.save()

    return { data: membership }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, project: Project, membership: Membership) {
    await bouncer.with('MembershipPolicy').authorize('delete', project, membership)

    await membership.delete()
  }
}
