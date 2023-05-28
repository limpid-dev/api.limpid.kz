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

Route.get('/users', 'UsersController.index')
Route.post('/users', 'UsersController.store').middleware(['guest'])
Route.get('/users/:user', 'UsersController.show')
Route.patch('/users/:user', 'UsersController.update').middleware(['auth'])

Route.get('/session', 'SessionController.show').middleware(['auth'])
Route.post('/session', 'SessionController.store').middleware(['guest'])
Route.delete('/session', 'SessionController.destroy').middleware(['auth'])

Route.post('/email-verification', 'EmailVerificationController.store').middleware([
  'auth',
  'emailUnVerified',
])
Route.patch('/email-verification', 'EmailVerificationController.update').middleware([
  'auth',
  'emailUnVerified',
])

Route.post('/password-recovery', 'PasswordRecoveryController.store').middleware(['guest'])
Route.patch('/password-recovery', 'PasswordRecoveryController.update').middleware(['guest'])

Route.get('/profiles', 'ProfilesController.index')
Route.get('/profiles/:profile', 'ProfilesController.show')
Route.patch('/profiles/:profile', 'ProfilesController.update').middleware(['auth', 'emailVerified'])

Route.get('/organizations', 'OrganizationsController.index')
Route.post('/organizations', 'OrganizationsController.store').middleware(['auth', 'emailVerified'])
Route.get('/organizations/:organization', 'OrganizationsController.show')
Route.patch('/organizations/:organization', 'OrganizationsController.update').middleware(['auth', 'emailVerified'])
Route.delete('/organizations/:organization', 'OrganizationsController.destroy').middleware(['auth', 'emailVerified'])

Route.get('/projects', 'ProjectsController.index')
Route.post('/projects', 'ProjectsController.store').middleware(['auth', 'emailVerified'])
Route.get('/projects/:project', 'ProjectsController.show')
Route.patch('/projects/:project', 'ProjectsController.update').middleware(['auth', 'emailVerified'])
Route.delete('/projects/:project', 'ProjectsController.destroy').middleware([
  'auth',
  'emailVerified',
])

Route.get('/tenders', 'TendersController.index')
Route.post('/tenders', 'TendersController.store').middleware(['auth', 'emailVerified'])
Route.get('/tenders/:tender', 'TendersController.show')
Route.patch('/tenders/:tender', 'TendersController.update').middleware(['auth', 'emailVerified'])
Route.delete('/tenders/:tender', 'TendersController.destroy').middleware(['auth', 'emailVerified'])

Route.group(() => {
  Route.get('/bids', 'TenderBidsController.index')
  Route.post('/bids', 'TenderBidsController.store').middleware(['auth', 'emailVerified'])
  Route.get('/bids/:tenderBid', 'TenderBidsController.show')
  Route.patch('/bids/:tenderBid', 'TenderBidsController.update').middleware([
    'auth',
    'emailVerified',
  ])
}).prefix('/tenders/:tender')
