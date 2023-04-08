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

Route.post('users', 'UsersController.store')

Route.post('recovery', 'RecoveryController.store')
Route.patch('recovery', 'RecoveryController.update')

Route.post('session', 'SessionController.store')

Route.group(() => {
  Route.get('users/:user', 'UsersController.show')
  Route.patch('users/:user', 'UsersController.update')

  Route.get('session', 'SessionController.show')
  Route.delete('session', 'SessionController.destroy')

  Route.post('verification', 'VerificationController.store')
  Route.patch('verification', 'VerificationController.update')

  Route.get('profiles', 'ProfilesController.index')
  Route.post('profiles', 'ProfilesController.store')
  Route.get('profiles/:profile', 'ProfilesController.show')
  Route.patch('profiles/:profile', 'ProfilesController.update')
  Route.delete('profiles/:profile', 'ProfilesController.destroy')

  Route.get('profiles/:profile/resources', 'ResourcesController.index')
  Route.post('profiles/:profile/resources', 'ResourcesController.store')
  Route.get('profiles/:profile/resources/:>resource', 'ResourcesController.show')
  Route.patch('profiles/:profile/resources/:>resource', 'ResourcesController.update')
  Route.delete('profiles/:profile/resources/:>resource', 'ResourcesController.destroy')

  // Route.resource('profiles.contacts', 'ContactsController').apiOnly()
  // Route.resource('profiles.educations', 'EducationsController').apiOnly()
  // Route.resource('profiles.experiences', 'ExperiencesController').apiOnly()
  // Route.resource('profiles.certificates', 'CertificatesController').apiOnly()
  // Route.resource('profiles.skills', 'SkillsController').apiOnly()

  // Route.resource('projects', 'ProjectsController').apiOnly()

  // Route.resource('projects.memberships', 'MembershipsController').apiOnly()
}).middleware('auth')
