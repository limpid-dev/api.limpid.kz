import Route from '@ioc:Adonis/Core/Route'

Route.get(
  'organizations/:organization/certificates/:>certificate/files',
  'OrganizationCertificateFilesController.index'
)
Route.post(
  'organizations/:organization/certificates/:>certificate/files',
  'OrganizationCertificateFilesController.store'
).middleware('auth:web,api')
Route.delete(
  'organizations/:organization/certificates/:>certificate/files/:>file',
  'OrganizationCertificateFilesController.destroy'
).middleware('auth:web,api')
