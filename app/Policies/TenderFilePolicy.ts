import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import File from 'App/Models/File'
import Tender from 'App/Models/Tender'

export default class TenderFilePolicy extends BasePolicy {
  public async create(user: User, tender: Tender) {
    const profile = await user.related('profiles').query().where('id', tender.profileId).first()

    console.log(!!profile && !tender.verifiedAt)

    return !!profile && !tender.verifiedAt
  }
  public async delete(user: User, tender: Tender, file: File) {
    const profile = await user.related('profiles').query().where('id', tender.profileId).first()

    return !!profile && tender.id === file.tenderId && !tender.verifiedAt
  }
}
