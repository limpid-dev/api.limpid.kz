import Route from '@ioc:Adonis/Core/Route'

Route.post('recoveries', 'RecoveryController.store')
Route.get('recoveries/:user(email)', 'RecoveryController.show')
