import Route from '@ioc:Adonis/Core/Route'

Route.get('organizations/:organization/experiences', 'OrganizationExperiencesController.index')
Route.post(
  'organizations/:organization/experiences',
  'OrganizationExperiencesController.store'
).middleware('auth:web,api')
Route.patch(
  'organizations/:organization/experiences/:>experience',
  'OrganizationExperiencesController.update'
).middleware('auth:web,api')
Route.delete(
  'organizations/:organization/experiences/:>experience',
  'OrganizationExperiencesController.destroy'
).middleware('auth:web,api')
