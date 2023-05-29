import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'
import IndexValidator from 'App/Validators/Projects/IndexValidator'
import StoreValidator from 'App/Validators/Projects/StoreValidator'
import UpdateValidator from 'App/Validators/Projects/UpdateValidator'

export default class ProjectsController {
  public async index({ request }: HttpContextContract) {
    const { page, per_page: perPage } = await request.validate(IndexValidator)

    const projects = await Project.query().paginate(page, perPage)

    return projects
  }

  public async store({ request, auth, response }: HttpContextContract) {
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

    if (auth.user?.selectedOrganizationId === null) {
      await auth.user.load('selectedOrganization')

      const project = await auth.user!.selectedOrganization.related('projects').create({
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

      response.status(201)

      return {
        data: project,
      }
    }

    await auth.user!.load('profile')

    const project = await auth.user!.profile.related('projects').create({
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

    response.status(201)

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
  public async update({ request }: HttpContextContract, project: Project) {
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
  public async destroy({ bouncer, response }: HttpContextContract, project: Project) {
    await bouncer.with('ProjectPolicy').authorize('delete', project)

    await project.delete()

    response.status(204)
  }
}
