import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Chat from 'App/Models/Chat'
import Project from 'App/Models/Project'
import IndexValidator from 'App/Validators/Projects/IndexValidator'
import StoreValidator from 'App/Validators/Projects/StoreValidator'
import UpdateValidator from 'App/Validators/Projects/UpdateValidator'

export default class ProjectsController {
  public async index({ request }: HttpContextContract) {
    const {
      page,
      per_page: perPage,
      industry,
      owned_money_amount: ownedMoneyAmount,
      required_money_amount: requiredMoneyAmount,
      search,
      stage,
      profile_id: profileId,
    } = await request.validate(IndexValidator)

    const query = Project.query()

    if (profileId) {
      query.where('profileId', profileId)
    }

    if (industry) {
      query.whereIn('industry', industry)
    }

    if (stage) {
      query.andWhereIn('stage', stage)
    }

    if (requiredMoneyAmount) {
      query.andWhereBetween('requiredMoneyAmount', [
        requiredMoneyAmount.min ?? 0,
        requiredMoneyAmount.max ?? Number.MAX_SAFE_INTEGER,
      ])
    }

    if (ownedMoneyAmount) {
      query.andWhereBetween('ownedMoneyAmount', [
        ownedMoneyAmount.min ?? 0,
        ownedMoneyAmount.max ?? Number.MAX_SAFE_INTEGER,
      ])
    }

    if (search) {
      query.andWhere((query) => {
        query
          .whereLike('title', `%${search}%`)
          .orWhereLike('description', `%${search}%`)
          .orWhereLike('location', `%${search}%`)
          .orWhereLike('requiredIntellectualResources', `%${search}%`)
          .orWhereLike('ownedIntellectualResources', `%${search}%`)
          .orWhereLike('requiredMaterialResources', `%${search}%`)
          .orWhereLike('ownedMaterialResources', `%${search}%`)
          .orWhereLike('profitability', `%${search}%`)
      })
    }

    const projects = await query.paginate(page, perPage)

    projects.queryString(request.qs())

    return projects
  }

  public async store({ auth, request }: HttpContextContract) {
    const {
      title: title,
      description: description,
      location: location,
      industry: industry,
      stage: stage,
      required_money_amount: requiredMoneyAmount,
      owned_money_amount: ownedMoneyAmount,
      required_intellectual_resources: requiredIntellectualResources,
      owned_intellectual_resources: ownedIntellectualResources,
      required_material_resources: requiredMaterialResources,
      owned_material_resources: ownedMaterialResources,
      profitability: profitability,
    } = await request.validate(StoreValidator)

    const chat = await Chat.create({
      name: title,
    })

    const project = await Project.create({
      title,
      description,
      location,
      industry,
      stage,
      requiredMoneyAmount,
      ownedMoneyAmount,
      requiredIntellectualResources,
      ownedIntellectualResources,
      requiredMaterialResources,
      ownedMaterialResources,
      profitability,
      profileId: auth.user!.selectedProfileId!,
      chatId: chat.id,
    })

    chat.merge({
      projectId: project.id,
    })

    await chat.save()

    await chat.related('members').create({
      userId: auth.user!.id,
    })

    return {
      data: project,
    }
  }

  @bind()
  public async show({}: HttpContextContract, project: Project) {
    return {
      data: project,
    }
  }

  @bind()
  public async update({ request, bouncer }: HttpContextContract, project: Project) {
    await bouncer.with('ProjectPolicy').authorize('update', project)

    const {
      title: title,
      description: description,
      location: location,
      industry: industry,
      stage: stage,
      required_money_amount: requiredMoneyAmount,
      owned_money_amount: ownedMoneyAmount,
      required_intellectual_resources: requiredIntellectualResources,
      owned_intellectual_resources: ownedIntellectualResources,
      required_material_resources: requiredMaterialResources,
      owned_material_resources: ownedMaterialResources,
      profitability: profitability,
    } = await request.validate(UpdateValidator)

    project.merge({
      title,
      description,
      location,
      industry,
      stage,
      requiredMoneyAmount,
      ownedMoneyAmount,
      requiredIntellectualResources,
      ownedIntellectualResources,
      requiredMaterialResources,
      ownedMaterialResources,
      profitability,
    })

    await project.save()

    return {
      data: project,
    }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, project: Project) {
    await bouncer.with('ProjectPolicy').authorize('delete', project)

    await project.delete()
  }
}
