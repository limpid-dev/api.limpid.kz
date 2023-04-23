import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Tender from 'App/Models/Tender'

export default class TenderPolicy extends BasePolicy {
  public async create(user: User) {}
  public async update(user: User, tender: Tender) {}
  public async delete(user: User, tender: Tender) {}
}
