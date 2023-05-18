import Route from '@ioc:Adonis/Core/Route'

Route.post('payment', 'PaymentController.paymentToken').middleware('auth:web,api')
Route.post('accepted-payment', 'PaymentController.checkPaymentStatusAccepted')
Route.post('refused-payment', 'PaymentController.checkPaymentStatusFailed')
