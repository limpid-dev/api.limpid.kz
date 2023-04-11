import Route from '@ioc:Adonis/Core/Route'

Route.post('recovery', 'RecoveryController.store')
Route.patch('recovery', 'RecoveryController.show')
