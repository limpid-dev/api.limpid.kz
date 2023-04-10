import Route from '@ioc:Adonis/Core/Route'

Route.get('projects/:project/messages', 'MessagesController.index')
Route.post('projects/:project/messages', 'MessagesController.store')
