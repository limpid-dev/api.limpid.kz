import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Education from 'App/Models/Education'
import Profile from 'App/Models/Profile'
import EducationsStoreValidator from 'App/Validators/EducationsStoreValidator'
import EducationsUpdateValidator from 'App/Validators/EducationsUpdateValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class EducationsController {
  @bind()
  public async index({ request }: HttpContextContract, profile: Profile) {
    const payload = await request.validate(PaginationValidator)

    return await profile.related('educations').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async store({ bouncer, request }: HttpContextContract, profile: Profile) {
    await bouncer.with('EducationPolicy').authorize('create', profile)
    const payload = await request.validate(EducationsStoreValidator)

    const education = await profile.related('educations').create(payload)

    return { data: education }
  }

  @bind()
  public async update(
    { bouncer, request }: HttpContextContract,
    profile: Profile,
    education: Education
  ) {
    await bouncer.with('EducationPolicy').authorize('update', profile, education)

    const payload = await request.validate(EducationsUpdateValidator)

    education.merge(payload)

    await education.save()

    return { data: education }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, profile: Profile, education: Education) {
    await bouncer.with('EducationPolicy').authorize('delete', profile, education)

    return await education.delete()
  }
}
