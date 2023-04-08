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

  Route.get('profiles/:profile/contacts', 'ContactsController.index')
  Route.post('profiles/:profile/contacts', 'ContactsController.store')
  Route.get('profiles/:profile/contacts/:>contact', 'ContactsController.show')
  Route.patch('profiles/:profile/contacts/:>contact', 'ContactsController.update')
  Route.delete('profiles/:profile/contacts/:>contact', 'ContactsController.destroy')

  Route.get('profiles/:profile/educations', 'EducationsController.index')
  Route.post('profiles/:profile/educations', 'EducationsController.store')
  Route.get('profiles/:profile/educations/:>education', 'EducationsController.show')
  Route.patch('profiles/:profile/educations/:>education', 'EducationsController.update')
  Route.delete('profiles/:profile/educations/:>education', 'EducationsController.destroy')

  Route.get('profiles/:profile/skills', 'SkillsController.index')
  Route.post('profiles/:profile/skills', 'SkillsController.store')
  Route.get('profiles/:profile/skills/:>skill', 'SkillsController.show')
  Route.patch('profiles/:profile/skills/:>skill', 'SkillsController.update')
  Route.delete('profiles/:profile/skills/:>skill', 'SkillsController.destroy')

  Route.get('profiles/:profile/certificates', 'CertificatesController.index')
  Route.post('profiles/:profile/certificates', 'CertificatesController.store')
  Route.get('profiles/:profile/certificates/:>certificate', 'CertificatesController.show')
  Route.patch('profiles/:profile/certificates/:>certificate', 'CertificatesController.update')
  Route.delete('profiles/:profile/certificates/:>certificate', 'CertificatesController.destroy')

  Route.get('profiles/:profile/experiences', 'ExperiencesController.index')
  Route.post('profiles/:profile/experiences', 'ExperiencesController.store')
  Route.get('profiles/:profile/experiences/:>experience', 'ExperiencesController.show')
  Route.patch('profiles/:profile/experiences/:>experience', 'ExperiencesController.update')
  Route.delete('profiles/:profile/experiences/:>experience', 'ExperiencesController.destroy')

  // Route.resource('projects', 'ProjectsController').apiOnly()

  // Route.resource('projects.memberships', 'MembershipsController').apiOnly()
}).middleware('auth')
