import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import IndexValidator from 'App/Validators/Users/IndexValidator'
import StoreValidator from 'App/Validators/Users/StoreValidator'
import UpdateValidator from 'App/Validators/Users/UpdateValidator'

export default class UsersController {
  public async index({ request }: HttpContextContract) {
    const { page, per_page: perPage } = await request.validate(IndexValidator)

    const users = await User.query().paginate(page, perPage)

    return users
  }

  public async store({ request, response }: HttpContextContract) {
    const {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    } = await request.validate(StoreValidator)

    const user = await User.updateOrCreate({ email }, { email, password, firstName, lastName })

    await user.related('profiles').create({
      displayName: `${user.firstName} ${user.lastName}`,
      isPersonal: true,
      isVisible: true,
    })

    response.status(201)

    return {
      data: user,
    }
  }

  @bind()
  public async show({}: HttpContextContract, user: User) {
    return {
      data: user,
    }
  }

  @bind()
  public async update({ request, bouncer }: HttpContextContract, user: User) {
    await bouncer.with('UserPolicy').authorize('update', user)
    const {
      email,
      password,
      selected_profile_id: selectedProfileId,
    } = await request.validate(UpdateValidator)

    const profileIdToSelect = selectedProfileId
      ? selectedProfileId
      : (await user.related('profiles').query().where('isPersonal', true).firstOrFail()).id

    user.merge({ email, password, selectedProfileId: profileIdToSelect })

    await user.save()

    return {
      data: user,
    }
  }
}
