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

Route.get('users/:user', 'UsersController.show')
Route.patch('users/:user', 'UsersController.update').middleware('auth')

Route.get('session', 'SessionController.show').middleware('auth')
Route.delete('session', 'SessionController.destroy').middleware('auth')

Route.post('verification', 'VerificationController.store').middleware('auth')
Route.patch('verification', 'VerificationController.update').middleware('auth')

Route.get('profiles', 'ProfilesController.index')
Route.post('profiles', 'ProfilesController.store').middleware('auth')
Route.get('profiles/:profile', 'ProfilesController.show')
Route.patch('profiles/:profile', 'ProfilesController.update').middleware('auth')
Route.delete('profiles/:profile', 'ProfilesController.destroy').middleware('auth')

Route.get('profiles/:profile/resources', 'ResourcesController.index')
Route.post('profiles/:profile/resources', 'ResourcesController.store').middleware('auth')
Route.get('profiles/:profile/resources/:>resource', 'ResourcesController.show')
Route.patch('profiles/:profile/resources/:>resource', 'ResourcesController.update').middleware(
  'auth'
)
Route.delete('profiles/:profile/resources/:>resource', 'ResourcesController.destroy').middleware(
  'auth'
)

Route.get('profiles/:profile/contacts', 'ContactsController.index')
Route.post('profiles/:profile/contacts', 'ContactsController.store').middleware('auth')
Route.get('profiles/:profile/contacts/:>contact', 'ContactsController.show')
Route.patch('profiles/:profile/contacts/:>contact', 'ContactsController.update').middleware('auth')
Route.delete('profiles/:profile/contacts/:>contact', 'ContactsController.destroy').middleware(
  'auth'
)

Route.get('profiles/:profile/educations', 'EducationsController.index')
Route.post('profiles/:profile/educations', 'EducationsController.store').middleware('auth')
Route.get('profiles/:profile/educations/:>education', 'EducationsController.show')
Route.patch('profiles/:profile/educations/:>education', 'EducationsController.update').middleware(
  'auth'
)
Route.delete('profiles/:profile/educations/:>education', 'EducationsController.destroy').middleware(
  'auth'
)

Route.get('profiles/:profile/skills', 'SkillsController.index')
Route.post('profiles/:profile/skills', 'SkillsController.store').middleware('auth')
Route.get('profiles/:profile/skills/:>skill', 'SkillsController.show')
Route.patch('profiles/:profile/skills/:>skill', 'SkillsController.update').middleware('auth')
Route.delete('profiles/:profile/skills/:>skill', 'SkillsController.destroy').middleware('auth')

Route.get('profiles/:profile/certificates', 'CertificatesController.index')
Route.post('profiles/:profile/certificates', 'CertificatesController.store').middleware('auth')
Route.get('profiles/:profile/certificates/:>certificate', 'CertificatesController.show')
Route.patch(
  'profiles/:profile/certificates/:>certificate',
  'CertificatesController.update'
).middleware('auth')
Route.delete(
  'profiles/:profile/certificates/:>certificate',
  'CertificatesController.destroy'
).middleware('auth')

Route.get('profiles/:profile/experiences', 'ExperiencesController.index')
Route.post('profiles/:profile/experiences', 'ExperiencesController.store').middleware('auth')
Route.get('profiles/:profile/experiences/:>experience', 'ExperiencesController.show')
Route.patch(
  'profiles/:profile/experiences/:>experience',
  'ExperiencesController.update'
).middleware('auth')
Route.delete(
  'profiles/:profile/experiences/:>experience',
  'ExperiencesController.destroy'
).middleware('auth')

Route.get('projects', 'ProjectsController.index')
Route.post('projects', 'ProjectsController.store').middleware('auth')
Route.get('projects/:project', 'ProjectsController.show')
Route.patch('projects/:project', 'ProjectsController.update').middleware('auth')
Route.delete('projects/:project', 'ProjectsController.destroy').middleware('auth')

Route.get('/projects/:project/files', 'ProjectFilesController.index')
Route.post('/projects/:project/files', 'ProjectFilesController.store').middleware('auth')
Route.get('/projects/:project/files/:>file', 'ProjectFilesController.show')
Route.delete('/projects/:project/files/:>file', 'ProjectFilesController.destroy').middleware('auth')

Route.get('projects/:project/memberships', 'MembershipsController.index')
Route.post('projects/:project/memberships', 'MembershipsController.store').middleware('auth')
Route.get('projects/:project/memberships/:>membership', 'MembershipsController.show')
Route.patch(
  'projects/:project/memberships/:>membership',
  'MembershipsController.update'
).middleware('auth')
Route.delete(
  'projects/:project/memberships/:>membership',
  'MembershipsController.destroy'
).middleware('auth')

Route.get('projects/:project/messages', 'MessagesController.index')
Route.post('projects/:project/messages', 'MessagesController.store').middleware('auth')
