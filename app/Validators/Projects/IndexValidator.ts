import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class IndexValidator {
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
  public schema = schema.create({
    page: schema.number([rules.unsigned()]),
    per_page: schema.number.optional([rules.unsigned()]),
    profile_id: schema.number.optional([
      rules.exists({
        table: 'profiles',
        column: 'id',
      }),
    ]),
    industry: schema.array.optional().members(schema.string()),
    stage: schema.array.optional().members(schema.string()),
    required_money_amount: schema.object.optional().members({
      min: schema.number.optional([rules.unsigned()]),
      max: schema.number.optional([rules.unsigned()]),
    }),
    owned_money_amount: schema.object.optional().members({
      min: schema.number.optional([rules.unsigned()]),
      max: schema.number.optional([rules.unsigned()]),
    }),
    search: schema.string.optional(),
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
