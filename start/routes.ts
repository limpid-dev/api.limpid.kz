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
Route.get('users/:user', 'UsersController.show')

Route.post('recovery', 'RecoveryController.store')
Route.patch('recovery', 'RecoveryController.update')

Route.post('session', 'SessionController.store')

Route.get('profiles', 'ProfilesController.index')
Route.get('profiles/:profile', 'ProfilesController.show')

Route.get('profiles/:profile/resources', 'ResourcesController.index')
Route.get('profiles/:profile/resources/:>resource', 'ResourcesController.show')

Route.get('profiles/:profile/contacts', 'ContactsController.index')
Route.get('profiles/:profile/contacts/:>contact', 'ContactsController.show')

Route.get('profiles/:profile/educations', 'EducationsController.index')
Route.get('profiles/:profile/educations/:>education', 'EducationsController.show')

Route.get('profiles/:profile/skills', 'SkillsController.index')
Route.get('profiles/:profile/skills/:>skill', 'SkillsController.show')

Route.get('profiles/:profile/certificates', 'CertificatesController.index')
Route.get('profiles/:profile/certificates/:>certificate', 'CertificatesController.show')

Route.get('profiles/:profile/experiences', 'ExperiencesController.index')
Route.get('profiles/:profile/experiences/:>experience', 'ExperiencesController.show')

Route.get('projects', 'ProjectsController.index')
Route.get('projects/:project', 'ProjectsController.show')

Route.get('projects/:project/files', 'ProjectFilesController.index')
Route.get('projects/:project/files/:>file', 'ProjectFilesController.show')

Route.group(() => {
  Route.patch('users/:user', 'UsersController.update')

  Route.get('session', 'SessionController.show')
  Route.delete('session', 'SessionController.destroy')

  Route.post('verification', 'VerificationController.store')
  Route.patch('verification', 'VerificationController.update')

  Route.group(() => {
    Route.post('profiles', 'ProfilesController.store')
    Route.patch('profiles/:profile', 'ProfilesController.update')
    Route.delete('profiles/:profile', 'ProfilesController.destroy')

    Route.post('profiles/:profile/resources', 'ResourcesController.store')
    Route.patch('profiles/:profile/resources/:>resource', 'ResourcesController.update')
    Route.delete('profiles/:profile/resources/:>resource', 'ResourcesController.destroy')

    Route.post('profiles/:profile/contacts', 'ContactsController.store')
    Route.patch('profiles/:profile/contacts/:>contact', 'ContactsController.update')
    Route.delete('profiles/:profile/contacts/:>contact', 'ContactsController.destroy')

    Route.post('profiles/:profile/educations', 'EducationsController.store')
    Route.patch('profiles/:profile/educations/:>education', 'EducationsController.update')
    Route.delete('profiles/:profile/educations/:>education', 'EducationsController.destroy')

    Route.post('profiles/:profile/skills', 'SkillsController.store')
    Route.patch('profiles/:profile/skills/:>skill', 'SkillsController.update')
    Route.delete('profiles/:profile/skills/:>skill', 'SkillsController.destroy')

    Route.post('profiles/:profile/certificates', 'CertificatesController.store')
    Route.patch('profiles/:profile/certificates/:>certificate', 'CertificatesController.update')
    Route.delete('profiles/:profile/certificates/:>certificate', 'CertificatesController.destroy')

    Route.post('profiles/:profile/experiences', 'ExperiencesController.store')
    Route.patch('profiles/:profile/experiences/:>experience', 'ExperiencesController.update')
    Route.delete('profiles/:profile/experiences/:>experience', 'ExperiencesController.destroy')

    Route.post('projects', 'ProjectsController.store')
    Route.patch('projects/:project', 'ProjectsController.update')
    Route.delete('projects/:project', 'ProjectsController.destroy')

    Route.post('projects/:project/files', 'ProjectFilesController.store')
    Route.delete('projects/:project/files/:>file', 'ProjectFilesController.destroy')

    Route.get('projects/:project/memberships', 'MembershipsController.index')
    Route.get('projects/:project/memberships/:>membership', 'MembershipsController.show')
    Route.post('projects/:project/memberships', 'MembershipsController.store')
    Route.patch('projects/:project/memberships/:>membership', 'MembershipsController.update')
    Route.delete('projects/:project/memberships/:>membership', 'MembershipsController.destroy')

    Route.get('projects/:project/messages', 'MessagesController.index')
    Route.post('projects/:project/messages', 'MessagesController.store')
  }).middleware('verified')
}).middleware('auth')
