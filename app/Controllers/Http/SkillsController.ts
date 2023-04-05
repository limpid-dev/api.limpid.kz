import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import Skill from 'App/Models/Skill'
import SkillsDestroyValidator from 'App/Validators/SkillsDestroyValidator'
import SkillsIndexValidator from 'App/Validators/SkillsIndexValidator'
import SkillsStoreValidator from 'App/Validators/SkillsStoreValidator'
import SkillsUpdateValidator from 'App/Validators/SkillsUpdateValidator'

export default class SkillsController {
  public async index({ request }: HttpContextContract) {
    const { params, ...payload } = await request.validate(SkillsIndexValidator)
    const profile = await Profile.findOrFail(params.profileId)

    return await profile.related('skills').query().paginate(payload.page, payload.perPage)
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const { params, ...payload } = await request.validate(SkillsStoreValidator)

    if (auth.user) {
      const profile = await Profile.findOrFail(params.profileId)

      if (profile.userId === auth.user.id) {
        return Skill.create({ profileId: params.profileId, ...payload })
      }
    }

    return response.forbidden({
      errors: [
        {
          message: 'You are not allowed to create a skill for this profile',
        },
      ],
    })
  }

  public async update({ request, auth, response }: HttpContextContract) {
    const { params, ...payload } = await request.validate(SkillsUpdateValidator)

    if (auth.user) {
      const profile = await Profile.findOrFail(params.profileId)

      if (profile.userId === auth.user.id) {
        const resource = await Skill.findByOrFail('id', params.skillId)

        resource.merge(payload)

        return await resource.save()
      }
    }
    return response.forbidden({
      errors: [
        {
          message: 'You are not allowed to update this skil',
        },
      ],
    })
  }

  public async destroy({ request, auth, response }: HttpContextContract) {
    const { params } = await request.validate(SkillsDestroyValidator)

    if (auth.user) {
      const profile = await Profile.findOrFail(params.profileId)

      if (profile.userId === auth.user.id) {
        const resource = await Skill.findByOrFail('id', params.skillId)

        await resource.delete()

        return response.gone()
      }
    }

    return response.forbidden({
      errors: [
        {
          message: 'You are not allowed to delete this skill',
        },
      ],
    })
  }
}
