import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Auction from 'App/Models/Auction'
import File from 'App/Models/File'
import AuctionFilesStoreValidator from 'App/Validators/AuctionFilesStoreValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class AuctionFilesController {
  @bind()
  public async index({ request }: HttpContextContract, auction: Auction) {
    const payload = await request.validate(PaginationValidator)

    return await auction.related('files').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async store({ request, bouncer }: HttpContextContract, auction: Auction) {
    await bouncer.with('AuctionFilePolicy').authorize('create', auction)

    const payload = await request.validate(AuctionFilesStoreValidator)

    const file = await File.from(payload.file)
      .merge({
        auctionId: auction.id,
      })
      .save()

    return {
      data: file,
    }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, auction: Auction, file: File) {
    await bouncer.with('AuctionFilePolicy').authorize('delete', auction, file)

    await file.delete()
  }
}
