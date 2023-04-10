import Route from '@ioc:Adonis/Core/Route'

Route.get('profiles', 'ProfilesController.index')
Route.get('profiles/:profile', 'ProfilesController.show')
Route.post('profiles', 'ProfilesController.store').middleware('auth')
Route.patch('profiles/:profile', 'ProfilesController.update').middleware('auth')
Route.delete('profiles/:profile', 'ProfilesController.destroy').middleware('auth')