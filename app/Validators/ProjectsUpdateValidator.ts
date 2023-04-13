import { rules, schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProjectsUpdateValidator {
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
    title: schema.string.optional({ trim: true }, [rules.minLength(1), rules.maxLength(255)]),
    description: schema.string.optional({ trim: true }, [
      rules.minLength(1),
      rules.maxLength(1024),
    ]),
    location: schema.string.optional({ trim: true }, [rules.minLength(1), rules.maxLength(255)]),
    industry: schema.string.optional({ trim: true }, [rules.minLength(1), rules.maxLength(255)]),
    stage: schema.string.optional({ trim: true }, [rules.minLength(1), rules.maxLength(64)]),
    requiredMoneyAmount: schema.number.optional([rules.range(1, 999999999999999.9999)]),
    ownedMoneyAmount: schema.number.optional([rules.range(1, 999999999999999.9999)]),
    requiredIntellectualResources: schema.string.optional({ trim: true }, [
      rules.minLength(1),
      rules.maxLength(1024),
    ]),
    ownedIntellectualResources: schema.string.optional({ trim: true }, [
      rules.minLength(1),
      rules.maxLength(1024),
    ]),
    requiredMaterialResources: schema.string.optional({ trim: true }, [
      rules.minLength(1),
      rules.maxLength(1024),
    ]),
    ownedMaterialResources: schema.string.optional({ trim: true }, [
      rules.minLength(1),
      rules.maxLength(1024),
    ]),
    profitability: schema.string.optional({ trim: true }, [
      rules.minLength(1),
      rules.maxLength(1024),
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
