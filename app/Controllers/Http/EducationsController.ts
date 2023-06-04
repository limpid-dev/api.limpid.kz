import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import StoreValidator from 'App/Validators/Educations/StoreValidator'
import UpdateValidator from 'App/Validators/Educations/UpdateValidator'
import Education from 'App/Models/Education'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class EducationsController {
  @bind()
  public async index({ request }: HttpContextContract, profile: Profile) {
    const { page, per_page: perPage } = await request.validate(PaginationValidator)

    return await Education.query().where('profileId', profile.id).paginate(page, perPage)
  }

  @bind()
  public async store({ bouncer, request, response }: HttpContextContract, profile: Profile) {
    await bouncer.with('ProfileSubResourcePolicy').authorize('create', profile)
    const {
      title,
      description,
      institution,
      started_at: startedAt,
      finished_at: finishedAt,
    } = await request.validate(StoreValidator)

    const education = new Education()

    education.merge({
      title,
      description,
      institution,
      startedAt,
      finishedAt,
      profileId: profile.id,
    })

    await education.save()

    response.created()

    return { data: education }
  }

  @bind()
  public async update(
    { bouncer, request }: HttpContextContract,
    profile: Profile,
    education: Education
  ) {
    await bouncer.with('ProfileSubResourcePolicy').authorize('update', profile, education)

    const {
      title,
      description,
      institution,
      started_at: startedAt,
      finished_at: finishedAt,
    } = await request.validate(UpdateValidator)

    education.merge({
      title,
      description,
      institution,
      startedAt,
      finishedAt,
    })

    await education.save()

    return { data: education }
  }

  @bind()
  public async destroy(
    { bouncer, response }: HttpContextContract,
    profile: Profile,
    education: Education
  ) {
    await bouncer.with('ProfileSubResourcePolicy').authorize('delete', profile, education)

    await education.delete()
    response.noContent()
  }
}
