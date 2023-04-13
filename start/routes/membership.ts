import Route from '@ioc:Adonis/Core/Route'

Route.get('projects/:project/memberships', 'MembershipsController.index')
Route.post('projects/:project/memberships', 'MembershipsController.store').middleware(
  'auth:web,api'
)
Route.patch(
  'projects/:project/memberships/:>membership',
  'MembershipsController.update'
).middleware('auth:web,api')
Route.delete(
  'projects/:project/memberships/:>membership',
  'MembershipsController.destroy'
).middleware('auth:web,api')
