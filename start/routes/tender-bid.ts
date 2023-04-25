import Route from '@ioc:Adonis/Core/Route'

Route.get('tenders/:tender/bids', 'TenderBidsController.index')
Route.post('tenders/:tender/bids', 'TenderBidsController.store').middleware('auth:web,api')
Route.patch('tenders/:tender/bids/:>bid', 'TenderBidsController.update').middleware('auth:web,api')
