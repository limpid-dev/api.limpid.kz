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
| new UnVerifiedException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class EmailUnVerifiedException extends Exception {
  constructor() {
    super('Your email is not verified', 403, 'E_EMAIL_UNVERIFIED')
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
