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
import Application from '@ioc:Adonis/Core/Application'

Route.on('/').render('swagger')

Route.get('/openapi.yaml', ({ response }) =>
  response.download(Application.makePath('openapi.yaml'))
)

Route.post('users', 'UsersController.store')

Route.post('session', 'SessionController.store')
Route.delete('session', 'SessionController.destroy').middleware('auth')

Route.post('email-verification', 'EmailVerificationController.store')
Route.patch('email-verification', 'EmailVerificationController.update')

Route.post('password-recovery', 'PasswordRecoveryController.store')
Route.patch('password-recovery', 'PasswordRecoveryController.update')

Route.get('user', 'UserController.show').middleware('auth')
Route.patch('user', 'UserController.update').middleware('auth')

Route.resource('profiles', 'ProfilesController')
  .apiOnly()
  .as('profiles')
  .middleware({
    '*': ['auth'],
  })

Route.group(() => {
  Route.resource('certificates', 'CertificatesController')
    .apiOnly()
    .as('profiles.certificates')
    .paramFor('certificates', '>certificate')
  Route.resource('educations', 'EducationsController')
    .apiOnly()
    .as('profiles.educations')
    .paramFor('educations', '>education')
  Route.resource('contacts', 'ContactsController')
    .apiOnly()
    .as('profiles.contacts')
    .paramFor('contacts', '>contact')
  Route.resource('skills', 'SkillsController')
    .apiOnly()
    .as('profiles.skills')
    .paramFor('skills', '>skill')
  Route.resource('experiences', 'ExperiencesController')
    .apiOnly()
    .as('profiles.experiences')
    .paramFor('experiences', '>experience')
})
  .prefix('profiles/:profile')
  .middleware('auth')

Route.resource('organizations', 'OrganizationsController')
  .apiOnly()
  .as('organizations')
  .middleware({
    '*': ['auth'],
  })
  .paramFor('organizations', 'organization')

Route.group(() => {
  Route.resource('certificates', 'CertificatesController')
    .apiOnly()
    .as('organizations.certificates')
    .paramFor('certificates', '>certificate')
  Route.resource('contacts', 'ContactsController')
    .apiOnly()
    .as('organizations.contacts')
    .paramFor('contacts', '>contact')

  Route.get('members', 'OrganizationMembersController.index')
  Route.post('members', 'OrganizationMembersController.store')
  Route.post('members/:member/accept', 'OrganizationMembersController.accept')
  Route.post('members/:member/reject', 'OrganizationMembersController.reject')
  Route.delete('members/:member', 'OrganizationMembersController.destroy')
})
  .prefix('organizations/:organization')
  .middleware('auth')
