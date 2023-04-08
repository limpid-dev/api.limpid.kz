/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.resource('users', 'UsersController').only(['store', 'show', 'update']).middleware({
  store: 'guest',
  show: 'auth',
  update: 'auth',
})

Route.post('session', 'SessionController.store').middleware('guest')
Route.get('session', 'SessionController.show').middleware('auth')
Route.delete('session', 'SessionController.destroy').middleware('auth')

Route.post('recovery', 'RecoveryController.store').middleware('guest')
Route.patch('recovery', 'RecoveryController.update').middleware('guest')

Route.post('verification', 'VerificationController.store').middleware('auth')
Route.patch('verification', 'VerificationController.update').middleware('auth')

Route.group(() => {
  Route.resource('profiles', 'ProfilesController').apiOnly()

  Route.resource('profiles.resources', 'ResourcesController').apiOnly()
  Route.resource('profiles.contacts', 'ContactsController').apiOnly()
  Route.resource('profiles.educations', 'EducationsController').apiOnly()
  Route.resource('profiles.experiences', 'ExperiencesController').apiOnly()
  Route.resource('profiles.certificates', 'CertificatesController').apiOnly()
  Route.resource('profiles.skills', 'SkillsController').apiOnly()

  Route.resource('projects', 'ProjectsController').apiOnly()

  Route.resource('projects.memberships', 'MembershipsController').apiOnly()
})
  .middleware('auth')
  .middleware('verification')
