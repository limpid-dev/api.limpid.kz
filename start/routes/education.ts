import Route from '@ioc:Adonis/Core/Route'

Route.get('profiles/:profile/educations', 'EducationsController.index')
Route.post('profiles/:profile/educations', 'EducationsController.store').middleware('auth')
Route.patch('profiles/:profile/educations/:>education', 'EducationsController.update').middleware(
  'auth'
)
Route.delete('profiles/:profile/educations/:>education', 'EducationsController.destroy').middleware(
  'auth'
)
