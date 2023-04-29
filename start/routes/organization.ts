import Route from '@ioc:Adonis/Core/Route'

Route.get('organizations', 'OrganizationsController.index')
Route.get('organizations/:organization', 'OrganizationsController.show')
Route.post('organizations', 'OrganizationsController.store').middleware('auth:web,api')
Route.patch('organizations/:organization', 'OrganizationsController.update').middleware(
  'auth:web,api'
)
Route.delete('organizations/:organization', 'OrganizationsController.destroy').middleware(
  'auth:web,api'
)
