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

Route.get('/users/@me', 'UsersMeController.index').middleware('auth')
Route.patch('/users/@me', 'UsersMeController.update').middleware('auth')

Route.post('/users', 'UsersController.store').middleware('guest')
Route.get('/users/:userId', 'UsersController.show').middleware('auth')

Route.post('/sessions', 'SessionsController.store').middleware('guest')
Route.delete('/sessions', 'SessionsController.destroy').middleware('auth')

Route.post('/recoveries', 'RecoveriesController.store').middleware('guest')
Route.post('/recoveries/:token', 'RecoveriesController.update').middleware('guest')

Route.post('/verifications', 'VerificationsController.store').middleware('auth')
Route.patch('/verifications/:token', 'VerificationsController.update').middleware('auth')

Route.resource('profiles', 'ProfilesController')
  .apiOnly()
  .paramFor('profiles', 'profileId')
  .middleware({
    '*': ['auth', 'verification'],
  })

Route.group(() => {
  Route.resource('resources', 'ResourcesController').apiOnly().paramFor('resources', 'resourceId')

  Route.resource('contacts', 'ContactsController').apiOnly().paramFor('contacts', 'contactId')

  Route.resource('educations', 'EducationsController')
    .apiOnly()
    .paramFor('educations', 'educationId')

  Route.resource('experiences', 'ExperiencesController')
    .apiOnly()
    .paramFor('experiences', 'experienceId')

  Route.resource('certificates', 'CertificatesController')
    .apiOnly()
    .paramFor('certificates', 'certificateId')

  Route.resource('skills', 'SkillsController').apiOnly().paramFor('skills', 'skillId')
})
  .prefix('/profiles/:profileId')
  .middleware(['auth', 'verification'])

Route.resource('projects', 'ProjectsController')
  .apiOnly()
  .paramFor('projects', 'projectId')
  .middleware({
    '*': ['auth', 'verification'],
  })

Route.group(() => {
  Route.resource('memberships', 'MembershipsController')
    .apiOnly()
    .paramFor('memberships', 'membershipId')
})
  .prefix('/projects/:projectId')
  .middleware(['auth', 'verification'])
