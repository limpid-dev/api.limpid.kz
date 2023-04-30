import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import File from 'App/Models/File'
import User from 'App/Models/User'
import PaginationValidator from 'App/Validators/PaginationValidator'
import UsersStoreValidator from 'App/Validators/UsersStoreValidator'
import UsersUpdateValidator from 'App/Validators/UsersUpdateValidator'

export default class UsersController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.validate(PaginationValidator)

    return await User.query().qs(request.qs()).paginate(payload.page, payload.perPage)
  }

  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(UsersStoreValidator)

    const user = await User.updateOrCreate({ email: payload.email }, payload)

    await user.load('file')

    return { data: user }
  }

  @bind()
  public async show({}: HttpContextContract, user: User) {
    await user.load('file')
    return { data: user }
  }

  @bind()
  public async update({ request, bouncer }: HttpContextContract, user: User) {
    await bouncer.with('UserPolicy').authorize('update', user)
    const { file, ...payload } = await request.validate(UsersUpdateValidator)

    if (file) {
      const old = await File.find(user.fileId)

      if (old) {
        await old.delete()
      }

      const avatar = File.from(file)

      const saved = await avatar
        .merge({
          userId: user.id,
        })
        .save()

      user.merge({ fileId: saved.id })
    }

    user.merge(payload)

    await user.save()

    await user.load('file')

    return { data: user }
  }
}
