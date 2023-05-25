import Route from '@ioc:Adonis/Core/Route'

Route.get('profiles/:profile/contacts', 'ProfileContactsController.index')
Route.post('profiles/:profile/contacts', 'ProfileContactsController.store').middleware('auth:web,api')
Route.patch('profiles/:profile/contacts/:>contact', 'ProfileContactsController.update').middleware(
  'auth:web,api'
)
Route.delete('profiles/:profile/contacts/:>contact', 'ProfileContactsController.destroy').middleware(
  'auth:web,api'
)
