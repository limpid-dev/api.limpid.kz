import Route from '@ioc:Adonis/Core/Route'

Route.get('projects/:project/files', 'ProjectFilesController.index')
Route.post('projects/:project/files', 'ProjectFilesController.store').middleware('auth:web,api')
Route.delete('projects/:project/files/:>file', 'ProjectFilesController.destroy').middleware(
  'auth:web,api'
)
