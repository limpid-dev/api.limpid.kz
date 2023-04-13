import Route from '@ioc:Adonis/Core/Route'

Route.get('profiles/:profile/certificates', 'CertificatesController.index')
Route.post('profiles/:profile/certificates', 'CertificatesController.store').middleware(
  'auth:web,api'
)
Route.patch(
  'profiles/:profile/certificates/:>certificate',
  'CertificatesController.update'
).middleware('auth:web,api')
Route.delete(
  'profiles/:profile/certificates/:>certificate',
  'CertificatesController.destroy'
).middleware('auth:web,api')
