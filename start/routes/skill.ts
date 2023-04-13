import Route from '@ioc:Adonis/Core/Route'

Route.get('profiles/:profile/skills', 'SkillsController.index')
Route.post('profiles/:profile/skills', 'SkillsController.store').middleware('auth:web,api')
Route.patch('profiles/:profile/skills/:>skill', 'SkillsController.update').middleware(
  'auth:web,api'
)
Route.delete('profiles/:profile/skills/:>skill', 'SkillsController.destroy').middleware(
  'auth:web,api'
)
