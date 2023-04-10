import Route from '@ioc:Adonis/Core/Route'

Route.get('profiles', 'ProfilesController.index')
Route.get('profiles/:profile', 'ProfilesController.show')
Route.post('profiles', 'ProfilesController.store')
Route.patch('profiles/:profile', 'ProfilesController.update')
Route.delete('profiles/:profile', 'ProfilesController.destroy')
