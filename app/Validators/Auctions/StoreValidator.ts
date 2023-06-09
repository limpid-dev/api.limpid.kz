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
    title: schema.string({ trim: true }, [rules.minLength(1), rules.maxLength(255)]),
    description: schema.string({ trim: true }, [rules.minLength(1), rules.maxLength(2048)]),
    starting_price: schema.number.optional([rules.range(1, Number.MAX_SAFE_INTEGER)]),
    purchase_price: schema.number.optional([
      rules.range(this.ctx.request.input('starting_price', 1) * 1.01, Number.MAX_SAFE_INTEGER),
    ]),
    duration: schema.string({ trim: true }, [rules.duration()]),
    industry: schema.string({ trim: true }, [rules.minLength(1), rules.maxLength(255)]),
    type: schema.string.optional({ trim: true }, [rules.minLength(1), rules.maxLength(255)]),
    technical_specification: schema.file.optional({
      size: '64mb',
      extnames: ['pdf', 'docx'],
    }),
    photo_one: schema.file.optional({
      size: '1mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    }),
    photo_two: schema.file.optional({
      size: '1mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    }),
    photo_three: schema.file.optional({
      size: '1mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    }),
    photo_four: schema.file.optional({
      size: '1mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    }),
    photo_five: schema.file.optional({
      size: '1mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
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
