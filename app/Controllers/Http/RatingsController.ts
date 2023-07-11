import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Rating from 'App/Models/Rating'
import Profile from 'App/Models/Profile'
import { bind } from '@adonisjs/route-model-binding'
import IndexValidator from 'App/Validators/Ratings/IndexValidator'
import StoreValidator from 'App/Validators/Ratings/StoreValidator'
import UpdateValidator from 'App/Validators/Ratings/UpdateValidator'

export default class RatingsController {
  @bind()
  public async index({ request }: HttpContextContract, profile: Profile) {
    const {
      page,
      per_page: perPage,
    } = await request.validate(IndexValidator)
    
    const review  = await Rating.query()
      .where('ratedProfileId', profile.id)
      .preload('rankingProfile')
      .paginate(page, perPage)
      
    review.queryString(request.qs())

    return review
  }

  @bind()
  public async store({ auth, bouncer, request }: HttpContextContract, profile: Profile) {
    const {
      comment: comment,
      cooperation_type: cooperationType,
      ranking_role: rankingRole,
      rated_role: ratedRole,
      cooperation_url: cooperationUrl,
      rating_number: ratingNumber,
    } = await request.validate(StoreValidator)

    await bouncer.with('RatingPolicy').authorize('create', profile)

    const review = new Rating()

    review.merge({
      ratingNumber,
      comment,
      cooperationType,
      rankingRole,
      ratedRole,
      cooperationUrl,
      rankingProfileId: auth.user!.selectedProfileId!,
      ratedProfileId: profile.id,
    })

    await review.save()

    return {
      data: review,
    }
  }

  @bind()
  public async show({}: HttpContextContract, profile: Profile, rating: Rating) {
    const review = await Rating.query()
      .where('ratedProfileId', profile.id)
      .whereNotNull('verifiedAt')
      .where('id', rating.id)

    return {
      data: review,
    }
  }

  @bind()
  public async showRating({}: HttpContextContract, profile: Profile) {
    const review = await Rating.query().where('ratedProfileId', profile.id)

    const averageRating = await Rating.query()
      .where('ratedProfileId', profile.id)
      .avg('rating_number as ratingNumber')

    const total = review.length

    const avg = averageRating.map((average) => {
      return {average: average.$extras.ratingNumber}
    })

    const average = avg[0].average

    return {
      data: { average, total }
    }
  }

  @bind()
  public async update({ bouncer, request }: HttpContextContract, rating: Rating) {
    const {
      comment: comment,
      cooperation_type: cooperationType,
      ranking_role: rankingRole,
      rated_role: ratedRole,
      cooperation_url: cooperationUrl,
      rating_number: ratingNumber,
    } = await request.validate(UpdateValidator)

    await bouncer.with('RatingPolicy').authorize('update', rating)

    const review = new Rating()

    review.merge({
      ratingNumber,
      comment,
      cooperationType,
      rankingRole,
      ratedRole,
      cooperationUrl,
    })

    await review.save()

    return {
      data: review,
    }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, rating: Rating) {
    await bouncer.with('RatingPolicy').authorize('delete', rating)

    await rating.delete()
  }
}
