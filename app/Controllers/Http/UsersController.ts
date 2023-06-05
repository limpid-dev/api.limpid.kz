import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import StoreValidator from 'App/Validators/Users/StoreValidator'
import { Secret } from 'otpauth'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    } = await request.validate(StoreValidator)

    const secret = new Secret({ size: 64 })

    const user = await User.create({
      email,
      password,
      secret: secret.base32,
      firstName,
      lastName,
    })

    response.status(201)

    return {
      data: user,
    }
  }
}
