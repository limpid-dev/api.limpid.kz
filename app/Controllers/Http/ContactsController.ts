import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import StoreValidator from 'App/Validators/Contacts/StoreValidator'
import UpdateValidator from 'App/Validators/Contacts/UpdateValidator'
import Contact from 'App/Models/Contact'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class ContactsController {
  @bind()
  public async index({ request }: HttpContextContract, profile: Profile) {
    const { page, per_page: perPage } = await request.validate(PaginationValidator)

    return await Contact.query().where('profileId', profile.id).paginate(page, perPage)
  }

  @bind()
  public async store({ bouncer, request }: HttpContextContract, profile: Profile) {
    await bouncer.with('ProfileSubResourcePolicy').authorize('create', profile)
    const { name, value } = await request.validate(StoreValidator)

    const contact = new Contact()

    contact.merge({
      name,
      value,
      profileId: profile.id,
    })

    await contact.save()

    return { data: contact }
  }

  @bind()
  public async update(
    { bouncer, request }: HttpContextContract,
    profile: Profile,
    contact: Contact
  ) {
    await bouncer.with('ProfileSubResourcePolicy').authorize('update', profile, contact)

    const { name, value } = await request.validate(UpdateValidator)

    contact.merge({
      name,
      value,
    })

    await contact.save()

    return { data: contact }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, profile: Profile, contact: Contact) {
    await bouncer.with('ProfileSubResourcePolicy').authorize('delete', profile, contact)

    await contact.delete()
  }
}
