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
    title: schema.string.optional({ trim: true }, [rules.minLength(1), rules.maxLength(255)]),
    description: schema.string.optional({ trim: true }, [
      rules.minLength(1),
      rules.maxLength(2048),
    ]),
    location: schema.string.optional({ trim: true }, [rules.minLength(1), rules.maxLength(255)]),
    industry: schema.string.optional({ trim: true }, [rules.minLength(1), rules.maxLength(255)]),
    stage: schema.string.optional({ trim: true }, [rules.minLength(1), rules.maxLength(255)]),
    required_money_amount: schema.number.optional([rules.range(0, Number.MAX_SAFE_INTEGER)]),
    owned_money_amount: schema.number.optional([rules.range(0, Number.MAX_SAFE_INTEGER)]),
    required_intellectual_resources: schema.string.optional({ trim: true }, [
      rules.minLength(1),
      rules.maxLength(2048),
    ]),
    owned_intellectual_resources: schema.string.optional({ trim: true }, [
      rules.minLength(1),
      rules.maxLength(2048),
    ]),
    required_material_resources: schema.string.optional({ trim: true }, [
      rules.minLength(1),
      rules.maxLength(2048),
    ]),
    owned_material_resources: schema.string.optional({ trim: true }, [
      rules.minLength(1),
      rules.maxLength(2048),
    ]),
    profitability: schema.string.optional({ trim: true }, [
      rules.minLength(1),
      rules.maxLength(2048),
    ]),
    logo: schema.file.optional({
      extnames: ['jpg', 'png', 'jpeg'],
      size: '1mb',
    }),
    video_introduction: schema.file.optional({
      extnames: ['mp4'],
      size: '128mb',
    }),
    presentation: schema.file.optional({
      extnames: ['pdf', 'pptx'],
      size: '8mb',
    }),
    business_plan: schema.file.optional({
      extnames: ['pdf', 'docx'],
      size: '8mb',
    }),
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
