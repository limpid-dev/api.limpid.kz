import Route from '@ioc:Adonis/Core/Route'

Route.get('projects', 'ProjectsController.index')
Route.get('projects/:project', 'ProjectsController.show')
Route.post('projects', 'ProjectsController.store')
Route.patch('projects/:project', 'ProjectsController.update')
Route.delete('projects/:project', 'ProjectsController.destroy')
