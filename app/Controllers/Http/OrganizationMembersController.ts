import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Organization from 'App/Models/Organization'

export default class OrganizationMembersController {
  public async index({}: HttpContextContract, organization: Organization) {}

  public async store({}: HttpContextContract, organization: Organization) {}

  public async show({}: HttpContextContract, organization: Organization) {}

  public async destroy({}: HttpContextContract, organization: Organization) {}
}
