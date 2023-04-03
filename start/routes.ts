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
Route.patch('/users/@me', 'UsersMeController.update').middleware('auth').middleware('confirmation')

Route.post('/users', 'UsersController.store')
Route.get('/users/:userId', 'UsersController.show').middleware('auth')

Route.post('/auth/login', 'AuthController.login').middleware('guest')
Route.post('/auth/logout', 'AuthController.logout').middleware('auth')

Route.post('/auth/recovery', 'RecoveryController.store')
Route.post('/auth/recovery/:token', 'RecoveryController.update')

Route.post('/auth/verification', 'VerificationController.store').middleware('auth')
Route.post('/auth/verification/:token', 'VerificationController.update').middleware('auth')

Route.get('/profiles', 'ProfilesController.index').middleware('auth')
Route.post('/profiles', 'ProfilesController.store').middleware('auth').middleware('verification')
Route.get('/profiles/:profileId', 'ProfilesController.show').middleware('auth')
Route.patch('/profiles/:profileId', 'ProfilesController.update')
  .middleware('auth')
  .middleware('verification')
Route.delete('/profiles/:profileId', 'ProfilesController.destroy')
  .middleware('auth')
  .middleware('verification')
  .middleware('confirmation')

Route.get('/profiles/:profileId/resources', 'ResourcesController.index').middleware('auth')
Route.post('/profiles/:profileId/resources', 'ResourcesController.store')
  .middleware('auth')
  .middleware('verification')
Route.patch('/profiles/:profileId/resources/:resourceId', 'ResourcesController.update')
  .middleware('auth')
  .middleware('verification')
Route.delete('/profiles/:profileId/resources/:resourceId', 'ResourcesController.destroy')
  .middleware('auth')
  .middleware('verification')

Route.get('/profiles/:profileId/contacts', 'ContactsController.index').middleware('auth')
Route.post('/profiles/:profileId/contacts', 'ContactsController.store')
  .middleware('auth')
  .middleware('verification')
Route.patch('/profiles/:profileId/contacts/:contactId', 'ContactsController.update')
  .middleware('auth')
  .middleware('verification')
Route.delete('/profiles/:profileId/contacts/:contactId', 'ContactsController.destroy')
  .middleware('auth')
  .middleware('verification')
