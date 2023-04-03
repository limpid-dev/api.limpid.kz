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
| new UnVerifiedException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class UnVerifiedException extends Exception {
  constructor() {
    super('You are not verified', 403, 'E_UNVERIFIED')
  }

  /**
   * The handle method allows you to self handle the exception and
   * return an HTTP response.
   *
   * This is how it works under the hood.
   *
   * - You raise this exception
   * - The exception goes uncatched/unhandled through out the entire HTTP request cycle.
   * - Just before making the response. AdonisJS will call the `handle` method.
   *   Giving you a chance to convert the exception to response.
   *
   */

  public async handle(_: this, ctx: HttpContextContract) {
    if (ctx.request.accepts(['json']) === 'json') {
      ctx.response.status(this.status).send({
        errors: [
          {
            message: this.message,
          },
        ],
      })
    }
  }
}
