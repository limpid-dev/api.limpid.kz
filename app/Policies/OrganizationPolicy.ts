import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'

export default class OrganizationPolicy extends BasePolicy {
	public static stripRestrictedViewFieldsFromOrganization = (profile: Profile) => ({
		id: profile.id,
				is_visible: profile.isVisible,
				display_name: profile.displayName,
	  })

	public async view(user: User, profile: Profile) {}
	public async create(user: User) {}
	public async update(user: User, profile: Profile) {}
	public async delete(user: User, profile: Profile) {}
}
