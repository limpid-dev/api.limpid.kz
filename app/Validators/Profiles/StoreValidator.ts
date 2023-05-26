import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
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
    display_name: schema.string({ trim: true }, [rules.minLength(1), rules.maxLength(255)]),
    description: schema.string({ trim: true }, [rules.minLength(1), rules.maxLength(255)]),
    location: schema.string({ trim: true }, [rules.minLength(1), rules.maxLength(255)]),
    industry: schema.string({ trim: true }, [rules.minLength(1), rules.maxLength(255)]),
    owned_intellectual_resources: schema.string({ trim: true }, [
      rules.minLength(1),
      rules.maxLength(2048),
    ]),
    owned_material_resources: schema.string({ trim: true }, [
      rules.minLength(1),
      rules.maxLength(2048),
    ]),
    bin: schema.string.optional({ trim: true }, [rules.minLength(1), rules.maxLength(12)]),
    perfomance: schema.string.optional({ trim: true }, [rules.minLength(1), rules.maxLength(2048)]),
    type: schema.string.optional({ trim: true }, [rules.minLength(1), rules.maxLength(255)]),
    is_visible: schema.boolean(),
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
