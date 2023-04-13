import Route from '@ioc:Adonis/Core/Route'

Route.get('auctions/:auction/bids', 'AuctionBidsController.index')
Route.post('auctions/:auction/bids', 'AuctionBidsController.store').middleware('auth:web,api')
Route.patch('auctions/:auction/bids/:>bid', 'AuctionBidsController.update').middleware(
  'auth:web,api'
)
Route.delete('auctions/:auction/bids/:>bid', 'AuctionBidsController.destroy').middleware(
  'auth:web,api'
)
