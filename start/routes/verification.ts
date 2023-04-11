import Route from '@ioc:Adonis/Core/Route'

Route.post('verification', 'VerificationController.store')
Route.patch('verification', 'VerificationController.update')
