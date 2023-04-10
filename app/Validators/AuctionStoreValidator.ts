import { rules, schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'

export default class AuctionStoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */

  public refs = schema.refs({
    maximumStartedDate: DateTime.now().plus({ days: 30 }),
    minimumStartedDate: DateTime.now().plus({ hours: 1 }),
    maximumFinishedDate: DateTime.fromISO(this.ctx.request.input('startedAt')).plus({ days: 30 }),
    minimumFinishedDate: DateTime.fromISO(this.ctx.request.input('startedAt')).plus({
      minutes: 15,
    }),
  })

  public schema = schema.create({
    title: schema.string({ trim: true }, [rules.minLength(1), rules.maxLength(255)]),
    description: schema.string({ trim: true }, [rules.minLength(1), rules.maxLength(1024)]),
    startedAt: schema.date({}, [
      rules.after(this.refs.minimumStartedDate),
      rules.before(this.refs.maximumStartedDate),
    ]),
    finishedAt: schema.date({}, [
      rules.after(this.refs.minimumFinishedDate),
      rules.before(this.refs.maximumFinishedDate),
    ]),
    startingPrice: schema.number.optional([rules.range(1, 999999999999999.9999)]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {}
}
