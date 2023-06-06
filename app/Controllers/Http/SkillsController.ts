import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import StoreValidator from 'App/Validators/Skills/StoreValidator'
import UpdateValidator from 'App/Validators/Skills/UpdateValidator'
import Skill from 'App/Models/Skill'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class SkillsController {
  @bind()
  public async index({ request }: HttpContextContract, profile: Profile) {
    const { page, per_page: perPage } = await request.validate(PaginationValidator)

    return await Skill.query().where('profileId', profile.id).paginate(page, perPage)
  }

  @bind()
  public async store({ bouncer, request }: HttpContextContract, profile: Profile) {
    await bouncer.with('ProfileSubResourcePolicy').authorize('create', profile)
    const { name } = await request.validate(StoreValidator)

    const skill = new Skill()

    skill.merge({
      name,
      profileId: profile.id,
    })

    await skill.save()

    return { data: skill }
  }

  @bind()
  public async update({ bouncer, request }: HttpContextContract, profile: Profile, skill: Skill) {
    await bouncer.with('ProfileSubResourcePolicy').authorize('update', profile, skill)

    const { name } = await request.validate(UpdateValidator)

    skill.merge({
      name,
    })

    await skill.save()

    return { data: skill }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, profile: Profile, skill: Skill) {
    await bouncer.with('ProfileSubResourcePolicy').authorize('delete', profile, skill)

    await skill.delete()
  }
}
