import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import File from 'App/Models/File'
import Tender from 'App/Models/Tender'
import PaginationValidator from 'App/Validators/PaginationValidator'
import TenderFilesStoreValidator from 'App/Validators/TenderFilesStoreValidator'

export default class TenderFilesController {
  @bind()
  public async index({ request }: HttpContextContract, tender: Tender) {
    const payload = await request.validate(PaginationValidator)

    return await tender.related('files').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async store({ request, bouncer }: HttpContextContract, tender: Tender) {
    await bouncer.with('TenderFilePolicy').authorize('create', tender)

    const payload = await request.validate(TenderFilesStoreValidator)

    const file = await File.from(payload.file)
      .merge({
        tenderId: tender.id,
      })
      .save()

    return {
      data: file,
    }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, tender: Tender, file: File) {
    await bouncer.with('TenderFilePolicy').authorize('delete', tender, file)

    await file.delete()
  }
}
