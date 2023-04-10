import Route from '@ioc:Adonis/Core/Route'

Route.get('profiles/:profile/certificates', 'CertificatesController.index')
Route.post('profiles/:profile/certificates', 'CertificatesController.store')
Route.patch('profiles/:profile/certificates/:>certificate', 'CertificatesController.update')
Route.delete('profiles/:profile/certificates/:>certificate', 'CertificatesController.destroy')
