import Route from '@ioc:Adonis/Core/Route'

Route.get('profiles/:profile/educations', 'EducationsController.index')
Route.post('profiles/:profile/educations', 'EducationsController.store')
Route.patch('profiles/:profile/educations/:>education', 'EducationsController.update')
Route.delete('profiles/:profile/educations/:>education', 'EducationsController.destroy')
