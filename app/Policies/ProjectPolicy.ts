import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Project from 'App/Models/Project'

export default class ProjectPolicy extends BasePolicy {
	public async viewList(user: User) {}
	public async view(user: User, project: Project) {}
	public async create(user: User) {}
	public async update(user: User, project: Project) {}
	public async delete(user: User, project: Project) {}
}
