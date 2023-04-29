import Route from '@ioc:Adonis/Core/Route'

Route.get('organizations/:organization/contacts', 'OrganizationContactsController.index')
Route.post(
  'organizations/:organization/contacts',
  'OrganizationContactsController.store'
).middleware('auth:web,api')
Route.patch(
  'organizations/:organization/contacts/:>contact',
  'OrganizationContactsController.update'
).middleware('auth:web,api')
Route.delete(
  'organizations/:organization/contacts/:>contact',
  'OrganizationContactsController.destroy'
).middleware('auth:web,api')
