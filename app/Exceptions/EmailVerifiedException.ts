import { Exception } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new EmailVerifiedException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class EmailVerifiedException extends Exception {
  constructor() {
    super('Your email is already verified', 403, 'E_EMAIL_VERIFIED')
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
