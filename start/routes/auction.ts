import Route from '@ioc:Adonis/Core/Route'

Route.get('auctions', 'AuctionsController.index')
Route.get('auctions/:>auction', 'AuctionsController.show')
Route.post('auctions', 'AuctionsController.store').middleware('auth')
Route.patch('auctions/:>auction', 'AuctionsController.update').middleware('auth')
Route.delete('auctions/:>auction', 'AuctionsController.destroy').middleware('auth')
