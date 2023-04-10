import Route from '@ioc:Adonis/Core/Route'

Route.get('profiles/:profile/certificates/:>certificate/files', 'CertificateFilesController.index')
Route.post('profiles/:profile/certificates/:>certificate/files', 'CertificateFilesController.store')
Route.delete(
  'profiles/:profile/certificates/:>certificate/files/:>file',
  'CertificateFilesController.destroy'
)
