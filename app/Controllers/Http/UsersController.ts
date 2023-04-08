import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UsersShowValidator from 'App/Validators/UsersShowValidator'
import UsersStoreValidator from 'App/Validators/UsersStoreValidator'

export default class UsersController {
  public async store({ request }: HttpContextContract) {
    const { avatar, ...payload } = await request.validate(UsersStoreValidator)

    return User.create({
      avatar: avatar ? Attachment.fromFile(avatar) : null,
      ...payload,
    })
  }

  public async show({ request }: HttpContextContract) {
    const { params } = await request.validate(UsersShowValidator)

    return User.findOrFail(params.userId)
  }
}
