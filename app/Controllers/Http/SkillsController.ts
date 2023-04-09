import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import Skill from 'App/Models/Skill'
import PaginationValidator from 'App/Validators/PaginationValidator'
import SkillsStoreValidator from 'App/Validators/SkillsStoreValidator'
import SkillsUpdateValidator from 'App/Validators/SkillsUpdateValidator'

export default class SkillsController {
  @bind()
  public async index({ request }: HttpContextContract, profile: Profile) {
    const payload = await request.validate(PaginationValidator)

    return await profile.related('skills').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async store({ bouncer, request }: HttpContextContract, profile: Profile) {
    await bouncer.with('SkillPolicy').authorize('create', profile)
    const payload = await request.validate(SkillsStoreValidator)

    const skill = await profile.related('skills').create(payload)

    return { data: skill }
  }

  @bind()
  public async update({ bouncer, request }: HttpContextContract, _profile: Profile, skill: Skill) {
    await bouncer.with('SkillPolicy').authorize('update', skill)

    const payload = await request.validate(SkillsUpdateValidator)

    skill.merge(payload)

    await skill.save()

    return { data: skill }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, _profile: Profile, skill: Skill) {
    await bouncer.with('SkillPolicy').authorize('delete', skill)

    return await skill.delete()
  }
}
