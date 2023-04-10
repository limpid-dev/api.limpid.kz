import Route from '@ioc:Adonis/Core/Route'

Route.get('profiles/:profile/contacts', 'ContactsController.index')
Route.post('profiles/:profile/contacts', 'ContactsController.store')
Route.patch('profiles/:profile/contacts/:>contact', 'ContactsController.update')
Route.delete('profiles/:profile/contacts/:>contact', 'ContactsController.destroy')
