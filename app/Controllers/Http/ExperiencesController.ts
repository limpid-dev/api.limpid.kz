import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import StoreValidator from 'App/Validators/Experiences/StoreValidator'
import UpdateValidator from 'App/Validators/Experiences/UpdateValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'
import Experience from 'App/Models/Experience'

export default class ExperiencesController {
  @bind()
  public async index({ request }: HttpContextContract, profile: Profile) {
    const { page, per_page: perPage } = await request.validate(PaginationValidator)

    return await Experience.query().where('profileId', profile.id).paginate(page, perPage)
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

    const experience = new Experience()

    experience.merge({
      title,
      description,
      institution,
      startedAt,
      finishedAt,
      profileId: profile.id,
    })

    await experience.save()

    response.created()

    return { data: experience }
  }

  @bind()
  public async update(
    { bouncer, request }: HttpContextContract,
    profile: Profile,
    experience: Experience
  ) {
    await bouncer.with('ProfileSubResourcePolicy').authorize('update', profile, experience)

    const {
      title,
      description,
      institution,
      started_at: startedAt,
      finished_at: finishedAt,
    } = await request.validate(UpdateValidator)

    experience.merge({
      title,
      description,
      institution,
      startedAt,
      finishedAt,
    })

    await experience.save()

    return { data: experience }
  }

  @bind()
  public async destroy(
    { bouncer, response }: HttpContextContract,
    profile: Profile,
    experience: Experience
  ) {
    await bouncer.with('ProfileSubResourcePolicy').authorize('delete', profile, experience)

    await experience.delete()
    response.noContent()
  }
}
