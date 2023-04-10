import Route from '@ioc:Adonis/Core/Route'

Route.get('users/:user', 'UsersController.show')
Route.post('users', 'UsersController.store')
Route.patch('users/:user', 'UsersController.update')
