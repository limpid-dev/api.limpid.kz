import Route from '@ioc:Adonis/Core/Route'

Route.get('organizations/:organization/files', 'OrganizationFilesController.index')
Route.post('organizations/:organization/files', 'OrganizationFilesController.store').middleware(
  'auth:web,api'
)
Route.delete(
  'organizations/:organization/files/:>file',
  'OrganizationFilesController.destroy'
).middleware('auth:web,api')
