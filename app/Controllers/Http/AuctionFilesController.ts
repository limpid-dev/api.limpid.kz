import Drive from '@ioc:Adonis/Core/Drive'
import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Auction from 'App/Models/Auction'
import File from 'App/Models/File'
import Profile from 'App/Models/Profile'
import AuctionFilesStoreValidator from 'App/Validators/AuctionFilesStoreValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'
import ProfileActionValidator from 'App/Validators/ProfileActionValidator'

export default class AuctionFilesController {
  @bind()
  public async index({ request }: HttpContextContract, auction: Auction) {
    const payload = await request.validate(PaginationValidator)

    return await auction.related('files').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async store({ request, bouncer }: HttpContextContract, auction: Auction) {
    const { profileId } = await request.validate(ProfileActionValidator)

    const profile = await Profile.findOrFail(profileId)

    await bouncer.with('AuctionFilePolicy').authorize('create', profile, auction)

    const payload = await request.validate(AuctionFilesStoreValidator)

    const location = `./auctions/${auction.id}/files`
    const contentType = `${payload.file.extname}/${payload.file.subtype}`
    const visibility = 'public'
    const name = payload.file.clientName
    const size = payload.file.size
    const extname = payload.file.extname

    await payload.file.moveToDisk(location, {
      name,
      contentType,
      visibility,
      contentLength: size,
    })

    const file = await auction.related('files').create({
      name,
      location,
      visibility,
      contentType,
      size,
      extname,
    })

    return {
      data: file,
    }
  }

  @bind()
  public async destroy({ request, bouncer }: HttpContextContract, auction: Auction, file: File) {
    const { profileId } = await request.validate(ProfileActionValidator)

    const profile = await Profile.findOrFail(profileId)

    await bouncer.with('AuctionFilePolicy').authorize('delete', profile, auction, file)

    await Drive.delete(file.location)

    await file.delete()
  }
}