import Route from '@ioc:Adonis/Core/Route'

Route.get('tenders/:tender/files', 'TenderFilesController.index')
Route.post('tenders/:tender/files', 'TenderFilesController.store').middleware('auth:web,api')
Route.delete('tenders/:tender/files/:>file', 'TenderFilesController.destroy').middleware(
  'auth:web,api'
)
