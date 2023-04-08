import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Membership from 'App/Models/Membership'

const indexSchema = schema.create({
  params: schema.object().members({
    projectId: schema.number([rules.exists({ table: 'profiles', column: 'id' })]),
  }),
  page: schema.number([rules.unsigned()]),
  perPage: schema.number.optional([rules.unsigned()]),
})

const storeSchema = schema.create({
  params: schema.object().members({
    projectId: schema.number([rules.exists({ table: 'profiles', column: 'id' })]),
  }),
  profileId: schema.number([rules.exists({ table: 'profiles', column: 'id' })]),
})

export default class MembershipsController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.validate({ schema: indexSchema })
    return Membership.query()
      .where('projectId', payload.params.projectId)
      .paginate(payload.page, payload.perPage)
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const payload = await request.validate({ schema: storeSchema })

    if (auth.user) {
      const profile = await auth.user
        .related('profiles')
        .query()
        .where('id', payload.profileId)
        .first()

      if (profile) {
        const membership = await profile.related('memberships').create({
          projectId: payload.params.projectId,
          type: 'WAITING',
        })
        return membership
      }

      return response.forbidden({
        errors: [
          {
            message: 'You are not authorized to perform this action',
          },
        ],
      })
    }
  }

  public async update({}: HttpContextContract) {}
  public async destroy({}: HttpContextContract) {}
}
