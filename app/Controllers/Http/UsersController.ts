import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UsersStoreValidator from 'App/Validators/UsersStoreValidator'

export default class UsersController {
  public async store({ request }: HttpContextContract) {
    const { avatar, ...payload } = await request.validate(UsersStoreValidator)

    return User.create({
      avatar: avatar ? Attachment.fromFile(avatar) : null,
      ...payload,
    })
  }
}
