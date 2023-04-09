import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Experience from 'App/Models/Experience'
import Profile from 'App/Models/Profile'
import ExperiencesStoreValidator from 'App/Validators/ExperiencesStoreValidator'
import ExperiencesUpdateValidator from 'App/Validators/ExperiencesUpdateValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class ExperiencesController {
  @bind()
  public async index({ request }: HttpContextContract, profile: Profile) {
    const payload = await request.validate(PaginationValidator)

    return await profile.related('experiences').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async show({}: HttpContextContract, _profile: Profile, experience: Experience) {
    return { data: experience }
  }

  @bind()
  public async store({ bouncer, request }: HttpContextContract, profile: Profile) {
    await bouncer.with('ExperiencePolicy').authorize('create', profile)
    const payload = await request.validate(ExperiencesStoreValidator)

    const experience = profile.related('experiences').create(payload)

    return { data: experience }
  }

  @bind()
  public async update(
    { bouncer, request }: HttpContextContract,
    profile: Profile,
    experience: Experience
  ) {
    await bouncer.with('ExperiencePolicy').authorize('update', profile, experience)

    const payload = await request.validate(ExperiencesUpdateValidator)

    experience.merge(payload)

    await experience.save()

    return { data: experience }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, profile: Profile, experience: Experience) {
    await bouncer.with('ExperiencePolicy').authorize('delete', profile, experience)

    await experience.delete()
  }
}
