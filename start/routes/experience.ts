import Route from '@ioc:Adonis/Core/Route'

Route.get('profiles/:profile/experiences', 'ExperiencesController.index')
Route.post('profiles/:profile/experiences', 'ExperiencesController.store')
Route.patch('profiles/:profile/experiences/:>experience', 'ExperiencesController.update')
Route.delete('profiles/:profile/experiences/:>experience', 'ExperiencesController.destroy')
