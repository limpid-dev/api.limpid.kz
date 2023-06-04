import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UpdateValidator from 'App/Validators/User/UpdateValidator'

export default class UserController {
  public async show({ auth }: HttpContextContract) {
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
    } = await request.validate(UpdateValidator)

    auth.user!.merge({
      email,
      password,
      firstName,
      lastName,
      patronymic,
      bornAt,
      selectedProfileId,
    })

    await auth.user!.save()

    return {
      data: auth.user,
    }
  }
}
