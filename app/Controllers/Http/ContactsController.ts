import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Contact from 'App/Models/Contact'
import ContactsIndexValidator from 'App/Validators/ContactsIndexValidator'

export default class ContactsController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.validate(ContactsIndexValidator)

    return await Contact.query()
      .where('profileId', payload.params.profileId)
      .paginate(payload.page, payload.perPage)
  }

  public async store({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
