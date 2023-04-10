import Route from '@ioc:Adonis/Core/Route'

Route.get('profiles/:profile/resources', 'ResourcesController.index')
Route.post('profiles/:profile/resources', 'ResourcesController.store').middleware('auth')
Route.patch('profiles/:profile/resources/:>resource', 'ResourcesController.update').middleware(
  'auth'
)
Route.delete('profiles/:profile/resources/:>resource', 'ResourcesController.destroy').middleware(
  'auth'
)
