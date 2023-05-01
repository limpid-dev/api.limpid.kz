import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Contact from 'App/Models/Contact'
import Organization from 'App/Models/Organization'
import ContactsStoreValidator from 'App/Validators/ContactsStoreValidator'
import ContactsUpdateValidator from 'App/Validators/ContactsUpdateValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'

const ruleByType = {
  EMAIL: rules.email(),
  MOBILE: rules.mobile({ strict: true }),
  URL: rules.url(),
} as const

export default class OrganizationContactsController {
  @bind()
  public async index({ request }: HttpContextContract, organization: Organization) {
    const payload = await request.validate(PaginationValidator)

    return await organization.related('contacts').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async store({ bouncer, request }: HttpContextContract, organization: Organization) {
    await bouncer.with('OrganizationContactPolicy').authorize('create', organization)

    const payload = await request.validate(ContactsStoreValidator)

    const contact = await organization.related('contacts').create(payload)

    return { data: contact }
  }

  @bind()
  public async update(
    { bouncer, request }: HttpContextContract,
    organization: Organization,
    contact: Contact
  ) {
    await bouncer.with('OrganizationContactPolicy').authorize('update', organization, contact)

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
  public async destroy(
    { bouncer }: HttpContextContract,
    organization: Organization,
    contact: Contact
  ) {
    await bouncer.with('OrganizationContactPolicy').authorize('delete', organization, contact)

    await contact.delete()
  }
}
