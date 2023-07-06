import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UpdateValidator from 'App/Validators/User/UpdateValidator'
import User from 'App/Models/User'

export default class UserController {
  public async show({ auth }: HttpContextContract) {
    if (auth.user?.subPlansId) {
      const user = await User.query().preload('subPlans').where('id', auth.user.id)
      return {
        data: user,
      }
    }
    return {
      data: auth.user,
    }
  }

  public async update({ request, auth }: HttpContextContract) {
    const {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      patronymic,
      born_at: bornAt,
      selected_profile_id: selectedProfileId,
      is_product_tour_completed: isProductTourCompleted,
    } = await request.validate(UpdateValidator)

    auth.user!.merge({
      email,
      password,
      firstName,
      lastName,
      patronymic,
      bornAt,
      selectedProfileId,
      isProductTourCompleted,
    })

    await auth.user!.save()

    return {
      data: auth.user,
    }
  }
}
