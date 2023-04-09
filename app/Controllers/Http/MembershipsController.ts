import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Membership from 'App/Models/Membership'
import Profile from 'App/Models/Profile'
import Project from 'App/Models/Project'
import MembershipsIndexValidator from 'App/Validators/MembershipsIndexValidator'
import MembershipsStoreValidator from 'App/Validators/MembershipsStoreValidator'
import MembershipsUpdateValidator from 'App/Validators/MembershipsUpdateValidator'
import MembershipsViewValidator from 'App/Validators/MembershipsViewValidator'
import MembershipsDestroyValidator from 'App/Validators/MembershipsDestroyValidator'
import { DateTime } from 'luxon'

export default class MembershipsController {
  @bind()
  public async index({ bouncer, request }: HttpContextContract, project: Project) {
    const payload = await request.validate(MembershipsIndexValidator)

    const profile = await Profile.findOrFail(payload.profileId)

    await bouncer.with('MembershipPolicy').authorize('viewList', profile, project)

    return project.related('memberships').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async show(
    { request, bouncer }: HttpContextContract,
    project: Project,
    membership: Membership
  ) {
    const payload = await request.validate(MembershipsViewValidator)

    const profile = await Profile.findOrFail(payload.profileId)

    await bouncer.with('MembershipPolicy').authorize('view', profile, project, membership)

    return { data: membership }
  }

  @bind()
  public async store({ request, bouncer }: HttpContextContract, project: Project) {
    const payload = await request.validate(MembershipsStoreValidator)

    const profile = await Profile.findOrFail(payload.profileId)

    await bouncer.with('MembershipPolicy').authorize('create', profile)

    const membership = await project.related('memberships').create({ profileId: profile.id })

    return { data: membership }
  }

  @bind()
  public async update(
    { request, bouncer }: HttpContextContract,
    project: Project,
    membership: Membership
  ) {
    const payload = await request.validate(MembershipsUpdateValidator)

    const profile = await Profile.findOrFail(payload.profileId)

    await bouncer.with('MembershipPolicy').authorize('update', profile, project)

    membership.merge({ acceptedAt: DateTime.now() })

    await membership.save()

    return { data: membership }
  }

  @bind()
  public async destroy(
    { request, bouncer }: HttpContextContract,
    project: Project,
    membership: Membership
  ) {
    const payload = await request.validate(MembershipsDestroyValidator)

    const profile = await Profile.findOrFail(payload.profileId)

    await bouncer.with('MembershipPolicy').authorize('delete', profile, project, membership)

    await membership.delete()
  }
}
