import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Rating from 'App/Models/Rating'
import Profile from 'App/Models/Profile'
import { bind } from '@adonisjs/route-model-binding'
import StoreValidator from 'App/Validators/Ratings/StoreValidator'
import UpdateValidator from 'App/Validators/Ratings/UpdateValidator'

export default class RatingsController {
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
  public async show({ }: HttpContextContract, profile: Profile) {
    const review = await Rating.query().where('ratedProfileId', profile.id).whereNotNull('verifiedAt')

    return {
      data: review,
    }
  }

  @bind()
  public async showRating({ }: HttpContextContract, profile: Profile) {
    const review = await Rating.query().where('ratedProfileId', profile.id).whereNull('verifiedAt')
    const averageRating = await Rating.query().where('ratedProfileId', profile.id)
    .whereNull('verifiedAt').avg('rating_number as ratingNumber')
    const length = review.length

    const avg = averageRating.map((average) => {
      return {average: average.$extras.ratingNumber}
    })
    const averageNumber = avg[0].average
    return {
      data: {averageNumber, length}
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
