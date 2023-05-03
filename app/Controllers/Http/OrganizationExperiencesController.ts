import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Experience from 'App/Models/Experience'
import Organization from 'App/Models/Organization'
import ExperiencesStoreValidator from 'App/Validators/ExperiencesStoreValidator'
import ExperiencesUpdateValidator from 'App/Validators/ExperiencesUpdateValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class OrganizationExperiencesController {
  @bind()
  public async index({ request }: HttpContextContract, organization: Organization) {
    const payload = await request.validate(PaginationValidator)

    return await organization.related('experiences').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async store({ bouncer, request }: HttpContextContract, organization: Organization) {
    await bouncer.with('OrganizationExperiencePolicy').authorize('create', organization)
    const payload = await request.validate(ExperiencesStoreValidator)

    const experience = organization.related('experiences').create(payload)

    return { data: experience }
  }

  @bind()
  public async update(
    { bouncer, request }: HttpContextContract,
    organization: Organization,
    experience: Experience
  ) {
    await bouncer.with('OrganizationExperiencePolicy').authorize('update', organization, experience)

    const payload = await request.validate(ExperiencesUpdateValidator)

    experience.merge(payload)

    await experience.save()

    return { data: experience }
  }

  @bind()
  public async destroy(
    { bouncer }: HttpContextContract,
    organization: Organization,
    experience: Experience
  ) {
    await bouncer.with('OrganizationExperiencePolicy').authorize('delete', organization, experience)

    await experience.delete()
  }
}
