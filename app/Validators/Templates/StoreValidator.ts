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
    name_of_organisation: schema.string({ trim: true }, [rules.minLength(1)]),
    name_of_service_to_be_purchased: schema.string({ trim: true }, [rules.minLength(1)]),
    service_delivery_time: schema.string({ trim: true }, [rules.minLength(1)]),
    place_of_service_rendering: schema.string({ trim: true }, [rules.minLength(1)]),
    amount_of_advance_payment: schema.string({ trim: true }, [rules.minLength(1)]),
    payment_terms: schema.string({ trim: true }, [rules.minLength(1)]),
    guarantee_period: schema.string({ trim: true }, [rules.minLength(1)]),
    detailed_description_of_service_requirements: schema.string({ trim: true }, [
      rules.minLength(1),
    ]),
    input_data: schema.string.optional({ trim: true }, [rules.minLength(1)]),
    qualification_requirements_for_prospective_vendors: schema.string.optional({ trim: true }, [
      rules.minLength(1),
    ]),
    performance_security: schema.string.optional({ trim: true }, [rules.minLength(1)]),
    special_contract_conditions: schema.string.optional({ trim: true }, [rules.minLength(1)]),
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
