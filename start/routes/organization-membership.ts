import Route from '@ioc:Adonis/Core/Route'

Route.get('organizations/:organization/memberships', 'OrganizationMembershipsController.index')
Route.post(
  'organizations/:organization/memberships',
  'OrganizationMembershipsController.store'
).middleware('auth:web,api')
Route.delete(
  'organizations/:organization/memberships/:>membership',
  'OrganizationMembershipsController.destroy'
).middleware('auth:web,api')
