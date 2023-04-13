import Route from '@ioc:Adonis/Core/Route'

Route.get('auctions', 'AuctionsController.index')
Route.get('auctions/:auction', 'AuctionsController.show')
Route.post('auctions', 'AuctionsController.store').middleware('auth:web,api')
Route.delete('auctions/:auction', 'AuctionsController.destroy').middleware('auth:web,api')
