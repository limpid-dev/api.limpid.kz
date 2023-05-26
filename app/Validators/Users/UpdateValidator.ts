import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateValidator {
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
    email: schema.string.optional({ trim: true }, [
      rules.email(),
      rules.unique({
        table: 'users',
        column: 'email',
        whereNot: {
          email_verified_at: null,
        },
      }),
    ]),
    password: schema.string.optional({}, [rules.minLength(8), rules.maxLength(180)]),
    first_name: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
    last_name: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
    patronymic: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
    born_at: schema.date.optional({ format: 'yyyy-mm-dd'}),
    selected_profile_id: schema.number.optional([
      rules.exists({
        table: 'profiles',
        column: 'id',
        where: {
          user_id: this.ctx.auth.user?.id,
        },
      }),
    ]),
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
