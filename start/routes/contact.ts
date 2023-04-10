import Route from '@ioc:Adonis/Core/Route'

Route.get('profiles/:profile/contacts', 'ContactsController.index')
Route.post('profiles/:profile/contacts', 'ContactsController.store').middleware('auth')
Route.patch('profiles/:profile/contacts/:>contact', 'ContactsController.update').middleware('auth')
Route.delete('profiles/:profile/contacts/:>contact', 'ContactsController.destroy').middleware(
  'auth'
)
