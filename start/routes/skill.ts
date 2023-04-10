import Route from '@ioc:Adonis/Core/Route'

Route.get('profiles/:profile/skills', 'SkillsController.index')
Route.post('profiles/:profile/skills', 'SkillsController.store')
Route.patch('profiles/:profile/skills/:>skill', 'SkillsController.update')
Route.delete('profiles/:profile/skills/:>skill', 'SkillsController.destroy')
