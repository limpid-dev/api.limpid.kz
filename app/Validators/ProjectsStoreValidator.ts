import { rules, schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProjectsStoreValidator {
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
    profileId: schema.number([rules.exists({ table: 'profiles', column: 'id' })]),
    title: schema.string({ trim: true }, [rules.minLength(1), rules.maxLength(256)]),
    description: schema.string({ trim: true }, [rules.minLength(1), rules.maxLength(1024)]),
    location: schema.string({ trim: true }, [rules.minLength(1), rules.maxLength(256)]),
    industry: schema.string({ trim: true }, [rules.minLength(1), rules.maxLength(256)]),
    stage: schema.string({ trim: true }, [rules.minLength(1), rules.maxLength(64)]),
    attachments: schema.array().members(
      schema.file({
        extnames: ['jpg', 'png', 'jpeg', 'pdf', 'docx', 'xlsx', 'pptx'],
        size: '16mb',
      })
    ),
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
