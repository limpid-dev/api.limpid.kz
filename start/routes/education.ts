import Route from '@ioc:Adonis/Core/Route'

Route.get('profiles/:profile/educations', 'EducationsController.index')
Route.get('profiles/:profile/educations/:>education', 'EducationsController.show')
Route.post('profiles/:profile/educations', 'EducationsController.store').middleware('auth:web,api')
Route.patch('profiles/:profile/educations/:>education', 'EducationsController.update').middleware(
  'auth:web,api'
)
Route.delete('profiles/:profile/educations/:>education', 'EducationsController.destroy').middleware(
  'auth:web,api'
)
