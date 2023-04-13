import Route from '@ioc:Adonis/Core/Route'

Route.get('projects/:project/messages', 'MessagesController.index').middleware('auth:web,api')
Route.post('projects/:project/messages', 'MessagesController.store').middleware('auth:web,api')
