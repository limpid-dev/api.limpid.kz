import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new NotGuestException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class NotGuestException extends Exception {
  constructor() {
    super('You are not guest', 403, 'E_NOTGUEST')
  }

  public async handle(error: this, ctx: HttpContextContract) {
    ctx.response.status(error.status).json({
      error: [
        {
          code: error.code,
          message: error.message,
        },
      ],
    })
  }
}
