import Route from '@ioc:Adonis/Core/Route'

Route.get('projects/:project/memberships', 'ProjectMembershipsController.index')
Route.post('projects/:project/memberships', 'ProjectMembershipsController.store').middleware(
  'auth:web,api'
)
Route.patch(
  'projects/:project/memberships/:>membership',
  'ProjectMembershipsController.update'
).middleware('auth:web,api')
Route.delete(
  'projects/:project/memberships/:>membership',
  'ProjectMembershipsController.destroy'
).middleware('auth:web,api')
