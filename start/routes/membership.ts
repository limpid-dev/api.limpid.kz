import Route from '@ioc:Adonis/Core/Route'

Route.get('projects/:project/memberships', 'MembershipsController.index')
Route.post('projects/:project/memberships', 'MembershipsController.store')
Route.patch('projects/:project/memberships/:>membership', 'MembershipsController.update')
Route.delete('projects/:project/memberships/:>membership', 'MembershipsController.destroy')
