import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import ProfileMember from 'App/Models/ProfileMember'
import RejectValidator from 'App/Validators/Organizations/Members/RejectValidator'
import StoreValidator from 'App/Validators/Organizations/Members/StoreValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'
import { DateTime } from 'luxon'

export default class OrganizationMembersController {
  @bind()
  public async index({ request, bouncer }: HttpContextContract, profile: Profile) {
    await bouncer.with('OrganizationMembersPolicy').authorize('viewList', profile)

    const { page, per_page: perPage } = await request.validate(PaginationValidator)

    return profile.related('members').query().paginate(page, perPage)
  }

  @bind()
  public async store({ request, auth, bouncer }: HttpContextContract, profile: Profile) {
    await bouncer.with('OrganizationMembersPolicy').authorize('create', profile)
    const { application_message: applicationMessage } = await request.validate(StoreValidator)

    const membership = await ProfileMember.create({
      applicationMessage,
      profileId: profile.id,
      userId: auth.user!.id,
    })

    return {
      data: membership,
    }
  }

  @bind()
  public async accept({ bouncer }: HttpContextContract, profile: Profile, member: ProfileMember) {
    await bouncer.with('OrganizationMembersPolicy').authorize('update', profile, member)

    member.merge({
      acceptedAt: DateTime.now(),
    })

    await member.save()

    return {
      data: member,
    }
  }

  @bind()
  public async reject(
    { request, bouncer }: HttpContextContract,
    profile: Profile,
    member: ProfileMember
  ) {
    await bouncer.with('OrganizationMembersPolicy').authorize('update', profile, member)

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
  public async destroy({ bouncer }: HttpContextContract, profile: Profile, member: ProfileMember) {
    await bouncer.with('OrganizationMembersPolicy').authorize('delete', profile, member)

    await member.delete()
  }
}
