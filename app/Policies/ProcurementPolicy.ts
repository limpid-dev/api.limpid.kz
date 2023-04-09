import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Procurement from 'App/Models/Procurement'

export default class ProcurementPolicy extends BasePolicy {
  public async viewList(user: User) {}
  public async view(user: User, procurement: Procurement) {}
  public async create(user: User) {}
  public async update(user: User, procurement: Procurement) {}
  public async delete(user: User, procurement: Procurement) {}
}
