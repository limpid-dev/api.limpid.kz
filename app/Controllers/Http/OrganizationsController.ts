import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import OrganizationPolicy from 'App/Policies/OrganizationPolicy'
import IndexValidator from 'App/Validators/Organizations/IndexValidator'

export default class OrganizationsController {
  public async index({request,bouncer}: HttpContextContract) {
    const {
      page,
      per_page: perPage,
      user_id: userId,
      industry,
      search,
    } = await request.validate(IndexValidator)

    const profilesQuery = Profile.query()

    profilesQuery.where('isVisible', true)
    profilesQuery.where('isPersonal', false)

    profilesQuery.if(userId, (query) => {
      query.andWhere('userId', userId!)
    })

    profilesQuery.if(industry, (query) => {
      query.andWhereIn('industry', industry!)
    })

    profilesQuery.if(search, (query) => {
      query.andWhere((query) => {
        query.whereLike('displayName', `%${search}%`)
        query.orWhereILike('location', `%${search}%`)
      })
    })

    const profiles = await profilesQuery.paginate(page, perPage)

    const allowedToViewProfiles = await Promise.all(
      profiles.map(async (profile) => {
        const isAllowedToView = await bouncer.with('ProfilePolicy').allows('view', profile)

        if (isAllowedToView) {
          return {
            profile,
          }
        } else {
          return OrganizationPolicy.stripRestrictedViewFieldsFromProfile(profile)
        }
      })
    )

    return {
      meta: profiles.getMeta(),
      data: allowedToViewProfiles,
    }
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
