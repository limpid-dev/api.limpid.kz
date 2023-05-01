import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import File from 'App/Models/File'
import Organization from 'App/Models/Organization'
import OrganizationFilesStoreValidator from 'App/Validators/OrganizationFilesStoreValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class OrganizationFilesController {
  @bind()
  public async index({ request }: HttpContextContract, organization: Organization) {
    const payload = await request.validate(PaginationValidator)

    return await organization.related('files').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async store({ request, bouncer }: HttpContextContract, organization: Organization) {
    await bouncer.with('OrganizationFilePolicy').authorize('create', organization)

    const payload = await request.validate(OrganizationFilesStoreValidator)

    const file = await File.from(payload.file)
      .merge({
        organizationId: organization.id,
      })
      .save()

    return {
      data: file,
    }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, organization: Organization, file: File) {
    await bouncer.with('OrganizationFilePolicy').authorize('delete', organization, file)

    await file.delete()
  }
}
