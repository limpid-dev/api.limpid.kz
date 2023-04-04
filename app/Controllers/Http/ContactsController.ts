import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Contact from 'App/Models/Contact'
import Profile from 'App/Models/Profile'
import ContactsDestroyValidator from 'App/Validators/ContactsDestroyValidator'
import ContactsIndexValidator from 'App/Validators/ContactsIndexValidator'
import ContactsStoreValidator from 'App/Validators/ContactsStoreValidator'
import ContactsUpdateValidator from 'App/Validators/ContactsUpdateValidator'

const ruleByType = {
  EMAIL: rules.email(),
  MOBILE: rules.mobile({ strict: true }),
  URL: rules.url(),
} as const

export default class ContactsController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.validate(ContactsIndexValidator)

    return await Contact.query()
      .where('profileId', payload.params.profileId)
      .paginate(payload.page, payload.perPage)
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const { params, ...payload } = await request.validate(ContactsStoreValidator)

    if (auth.user) {
      const profile = await Profile.findOrFail(params.profileId)

      if (profile.userId === auth.user.id) {
        await request.validate({
          schema: schema.create({
            value: schema.string({}, [ruleByType[payload.type]]),
          }),
        })

        return await Contact.create({
          profileId: params.profileId,
          ...payload,
        })
      }
    }

    return response.forbidden({})
  }

  public async update({ request, auth, response }: HttpContextContract) {
    const { params, ...payload } = await request.validate(ContactsUpdateValidator)

    if (auth.user) {
      const profile = await Profile.findOrFail(params.profileId)

      if (profile.userId === auth.user.id) {
        const contact = await Contact.findOrFail(params.contactId)

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

        return await contact.merge(payload).save()
      }
    }

    return response.forbidden({})
  }

  public async destroy({ request, auth, response }: HttpContextContract) {
    const { params } = await request.validate(ContactsDestroyValidator)

    if (auth.user) {
      const profile = await Profile.findOrFail(params.profileId)

      if (profile.userId === auth.user.id) {
        const contact = await Contact.findOrFail(params.contactId)

        return await contact.delete()
      }
    }

    return response.forbidden({})
  }
}
