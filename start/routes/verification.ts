import Route from '@ioc:Adonis/Core/Route'

Route.post('verifications', 'VerificationController.store')
Route.get('verifications/:user(email)', 'VerificationController.show')
