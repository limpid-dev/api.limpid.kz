import Route from '@ioc:Adonis/Core/Route'

Route.get('profiles/:profile/experiences', 'ExperiencesController.index')
Route.post('profiles/:profile/experiences', 'ExperiencesController.store').middleware(
  'auth:web,api'
)
Route.patch(
  'profiles/:profile/experiences/:>experience',
  'ExperiencesController.update'
).middleware('auth:web,api')
Route.delete(
  'profiles/:profile/experiences/:>experience',
  'ExperiencesController.destroy'
).middleware('auth:web,api')
