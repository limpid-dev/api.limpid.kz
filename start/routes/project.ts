import Route from '@ioc:Adonis/Core/Route'

Route.get('projects', 'ProjectsController.index')
Route.get('projects/:project', 'ProjectsController.show')
Route.post('projects', 'ProjectsController.store').middleware('auth')
Route.patch('projects/:project', 'ProjectsController.update').middleware('auth')
Route.delete('projects/:project', 'ProjectsController.destroy').middleware('auth')
