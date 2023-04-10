import Route from '@ioc:Adonis/Core/Route'

Route.post('session', 'SessionController.store')
Route.get('session', 'SessionController.show').middleware('auth')
Route.delete('session', 'SessionController.destroy').middleware('auth')
