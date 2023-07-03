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

Route.on('/').render('documentation')

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

Route.group(() => {
  Route.get('organization-memberships', 'OrganizationMembershipsController.index')
  Route.get(
    'organization-memberships/:organizationMembership',
    'OrganizationMembershipsController.show'
  )
  Route.delete(
    'organization-memberships/:organizationMembership',
    'OrganizationMembershipsController.destroy'
  )
})
  .prefix('user')
  .middleware('auth')

Route.resource('profiles', 'ProfilesController').apiOnly().as('profiles').middleware({
  '*': 'auth',
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
  Route.resource('skills', 'SkillsController')
    .apiOnly()
    .as('profiles.skills')
    .paramFor('skills', '>skill')
  Route.resource('experiences', 'ExperiencesController')
    .apiOnly()
    .as('profiles.experiences')
    .paramFor('experiences', '>experience')

  Route.get('project-memberships', 'ProjectMembershipsController.index')
  Route.get('project-memberships/:>projectMembership', 'ProjectMembershipsController.show')
  Route.delete('project-memberships/:>projectMembership', 'ProjectMembershipsController.destroy')

  Route.get('tender-bids', 'ProfileTenderBidsController.index')

  Route.get('auction-bids', 'ProfileAuctionBidsController.index')
})
  .prefix('profiles/:profile')
  .middleware('auth')

Route.resource('organizations', 'OrganizationsController')
  .apiOnly()
  .as('organizations')
  .middleware({
    '*': 'auth',
  })
  .paramFor('organizations', 'organization')

Route.group(() => {
  Route.resource('certificates', 'CertificatesController')
    .apiOnly()
    .as('organizations.certificates')
    .paramFor('certificates', '>certificate')

  Route.get('project-memberships', 'ProjectMembershipsController.index')
  Route.get('project-memberships/:>projectMembership', 'ProjectMembershipsController.show')
  Route.delete('project-memberships/:>projectMembership', 'ProjectMembershipsController.destroy')

  Route.get('members', 'OrganizationMembersController.index')
  Route.post('members', 'OrganizationMembersController.store')
  Route.post('members/:>member/accept', 'OrganizationMembersController.accept')
  Route.post('members/:>member/reject', 'OrganizationMembersController.reject')
  Route.delete('members/:>member', 'OrganizationMembersController.destroy')

  Route.get('tender-bids', 'ProfileTenderBidsController.index')

  Route.get('auction-bids', 'ProfileAuctionBidsController.index')
})
  .prefix('organizations/:profile')
  .middleware('auth')

Route.resource('projects', 'ProjectsController')
  .apiOnly()
  .paramFor('projects', 'project')
  .middleware({
    '*': 'auth',
  })

Route.group(() => {
  Route.get('membership', 'ProjectMembersController.showMembership')
  Route.get('members', 'ProjectMembersController.index')
  Route.post('members', 'ProjectMembersController.store')
  Route.post('members/:>member/accept', 'ProjectMembersController.accept')
  Route.post('members/:>member/reject', 'ProjectMembersController.reject')
  Route.delete('members/:>member', 'ProjectMembersController.destroy')
})
  .prefix('projects/:project')
  .middleware('auth')

Route.get('/tenders', 'TendersController.index')
Route.post('/tenders', 'TendersController.store').middleware('auth')
Route.get('/tenders/:tender', 'TendersController.show')
Route.patch('/tenders/:tender', 'TendersController.update').middleware('auth')
Route.get('/tenders/:tender/winner', 'TendersController.showWinner').middleware('auth')
Route.patch('/tenders/:tender/winner', 'TendersController.updateWinner').middleware('auth')
Route.delete('/tenders/:tender', 'TendersController.destroy').middleware('auth')

Route.group(() => {
  Route.get('/bids', 'TenderBidsController.index')
  Route.post('/bid', 'TenderBidsController.store').middleware('auth')
  Route.get('/bid', 'TenderBidsController.show').middleware('auth')
  Route.patch('/bid', 'TenderBidsController.update').middleware('auth')
}).prefix('/tenders/:tender')

Route.get('/chats', 'ChatsController.index').middleware('auth')
Route.get('/chats/:chat', 'ChatsController.show').middleware('auth')
Route.post('/chats', 'ChatsController.store').middleware('auth')
Route.delete('/chats/:chat', 'ChatsController.destroy').middleware('auth')

Route.group(() => {
  Route.get('/messages', 'MessagesController.index')
  Route.post('/messages', 'MessagesController.store')

  Route.get('/members', 'MembersController.index')
})
  .prefix('/chats/:chat')
  .middleware('auth')

Route.get('/auctions', 'AuctionsController.index')
Route.post('/auctions', 'AuctionsController.store').middleware(['auth'])
Route.get('/auctions/:auction', 'AuctionsController.show')
Route.patch('/auctions/:auction', 'AuctionsController.update').middleware(['auth'])
Route.delete('/auctions/:auction', 'AuctionsController.destroy').middleware(['auth'])

Route.group(() => {
  Route.get('/bids', 'AuctionBidsController.index')
  Route.post('/bids', 'AuctionBidsController.store').middleware(['auth'])
  Route.get('/bids/user', 'AuctionBidsController.show')
  Route.patch('/bids/:auctionBid', 'AuctionBidsController.update').middleware(['auth'])
}).prefix('/auctions/:auction')

Route.get('/payments/:plan', 'PaymentsController.show').middleware(['auth'])
Route.get('/payments', 'PaymentsController.index').middleware(['auth'])
Route.post('/payments', 'PaymentsController.store')
Route.delete('/payments', 'PaymentsController.destroy').middleware(['auth'])

Route.get('/notifications', 'NotificationsController.index').middleware(['auth'])
Route.get('/notifications/:notification', 'NotificationsController.show').middleware(['auth'])
Route.post('/notifications/:notification/read', 'NotificationsController.read').middleware(['auth'])

Route.post('templates/', 'TemplatesController.store')

Route.get('profiles/:profile/winner', 'ProfilesController.showWinner').middleware('auth')