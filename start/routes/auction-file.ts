import Route from '@ioc:Adonis/Core/Route'

Route.get('auctions/:auction/files', 'AuctionFilesController.index')
Route.post('auctions/:auction/files', 'AuctionFilesController.store').middleware('auth')
Route.delete('auctions/:auction/files/:>file', 'AuctionFilesController.destroy').middleware('auth')
