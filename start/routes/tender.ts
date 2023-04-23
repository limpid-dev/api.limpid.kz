import Route from '@ioc:Adonis/Core/Route'

Route.get('/tenders', 'TendersController.index')
Route.get('/tenders/:tender', 'TendersController.show')
Route.post('/tenders', 'TendersController.store').middleware('auth:web,api')
Route.patch('/tenders/:tender', 'TendersController.update').middleware('auth:web,api')
Route.delete('/tenders/:tender', 'TendersController.destroy').middleware('auth:web,api')
