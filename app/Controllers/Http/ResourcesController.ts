import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import Resource from 'App/Models/Resource'
import PaginationValidator from 'App/Validators/PaginationValidator'
import ResourcesStoreValidator from 'App/Validators/ResourcesStoreValidator'
import ResourcesUpdateValidator from 'App/Validators/ResourcesUpdateValidator'

export default class ResourcesController {
  @bind()
  public async index({ bouncer, request }: HttpContextContract, profile: Profile) {
    await bouncer.with('ResourcePolicy').authorize('viewList', profile)

    const payload = await request.validate(PaginationValidator)

    return await profile.related('resources').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public static async show({ bouncer }: HttpContextContract, profile: Profile, resource: Resource) {
    await bouncer.with('ResourcePolicy').authorize('view', profile)

    return {
      data: resource,
    }
  }

  @bind()
  public async store({ bouncer, request }: HttpContextContract, profile: Profile) {
    await bouncer.with('ResourcePolicy').authorize('create', profile)

    const payload = await request.validate(ResourcesStoreValidator)

    const resource = await profile.related('resources').create(payload)

    return {
      data: resource,
    }
  }

  @bind()
  public async update(
    { bouncer, request }: HttpContextContract,
    profile: Profile,
    resource: Resource
  ) {
    await bouncer.with('ResourcePolicy').authorize('update', profile)

    const payload = await request.validate(ResourcesUpdateValidator)

    resource.merge(payload)

    await resource.save()

    return {
      data: resource,
    }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, profile: Profile, resource: Resource) {
    await bouncer.with('ResourcePolicy').authorize('delete', profile)

    await resource.delete()
  }
}
