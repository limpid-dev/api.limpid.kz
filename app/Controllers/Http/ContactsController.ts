import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Contact from 'App/Models/Contact'
import Profile from 'App/Models/Profile'
import ContactsStoreValidator from 'App/Validators/ContactsStoreValidator'
import ContactsUpdateValidator from 'App/Validators/ContactsUpdateValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'

const ruleByType = {
  EMAIL: rules.email(),
  MOBILE: rules.mobile({ strict: true }),
  URL: rules.url(),
} as const

export default class ContactsController {
  @bind()
  public async index({ request }: HttpContextContract, profile: Profile) {
    const payload = await request.validate(PaginationValidator)

    return await profile.related('contacts').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async show({}: HttpContextContract, profile: Profile, contact: Contact) {
    return { data: contact }
  }

  @bind()
  public async store({ bouncer, request }: HttpContextContract, profile: Profile) {
    await bouncer.with('ContactPolicy').authorize('create', profile)

    const payload = await request.validate(ContactsStoreValidator)

    const contact = await profile.related('contacts').create(payload)

    return { data: contact }
  }

  @bind()
  public async update(
    { bouncer, request }: HttpContextContract,
    profile: Profile,
    contact: Contact
  ) {
    await bouncer.with('ContactPolicy').authorize('update', profile, contact)

    const payload = await request.validate(ContactsUpdateValidator)

    if (payload.value) {
      if (payload.type) {
        await request.validate({
          schema: schema.create({
            value: schema.string({}, [ruleByType[payload.type]]),
          }),
        })
      } else {
        await request.validate({
          schema: schema.create({
            value: schema.string({}, [ruleByType[contact.type]]),
          }),
        })
      }
    }

    contact.merge(payload)

    await contact.save()

    return { data: contact }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, profile: Profile, contact: Contact) {
    await bouncer.with('ContactPolicy').authorize('delete', profile, contact)

    await contact.delete()
  }
}
