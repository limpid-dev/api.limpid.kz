import { rules, schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'

export default class ProcurementUpdateValidator {
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
    allowedDate: DateTime.local().plus({ days: 30 }),
  })

  public schema = schema.create({
    profileId: schema.number([rules.exists({ table: 'profiles', column: 'id' })]),
    title: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
    description: schema.string.optional({ trim: true }, [rules.maxLength(1024)]),
    budget: schema.number.optional([rules.range(1, 999999999999999.9999)]),
    startedAt: schema.date.optional(),
    finishedAt: schema.date.optional({}, [rules.beforeOrEqual(this.refs.allowedDate)]),
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
