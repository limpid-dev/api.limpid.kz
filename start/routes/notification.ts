import Route from '@ioc:Adonis/Core/Route'

Route.get('notifications', 'NotificationsController.index').middleware('auth:web,api')
Route.patch('notifications/:notification', 'NotificationsController.update').middleware(
  'auth:web,api'
)
