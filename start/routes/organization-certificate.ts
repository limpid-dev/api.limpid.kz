import Route from '@ioc:Adonis/Core/Route'

Route.get('organizations/:organization/certificates', 'CertificatesController.index')
Route.post('organizations/:organization/certificates', 'CertificatesController.store').middleware(
  'auth:web,api'
)
Route.patch(
  'organizations/:organization/certificates/:>certificate',
  'CertificatesController.update'
).middleware('auth:web,api')
Route.delete(
  'organizations/:organization/certificates/:>certificate',
  'CertificatesController.destroy'
).middleware('auth:web,api')
