import { rules, schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TechnicalTaskServiceValidator {
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
    nameOfOrganisation: schema.string({ trim: true }, [rules.minLength(1)]),
    customerIdNumber: schema.string({ trim: true }, [rules.minLength(1)]),
    nameOfServiceToBePurchased: schema.string({ trim: true }, [rules.minLength(1)]),
    serviceDeliveryTime: schema.string({ trim: true }, [rules.minLength(1)]),
    placeOfServiceRendering: schema.string({ trim: true }, [rules.minLength(1)]),
    amountOfAdvancePayment: schema.string({ trim: true }, [rules.minLength(1)]),
    paymentTerms: schema.string({ trim: true }, [rules.minLength(1)]),
    guaranteePeriod: schema.string({ trim: true }, [rules.minLength(1)]),
    detailedDescriptionOfServiceRequirements: schema.string({ trim: true }, [rules.minLength(1)]),
    inputData: schema.string({ trim: true }, [rules.minLength(1)]),
    qualificationRequirementsForProspectiveVendors: schema.string.optional({ trim: true }, [
      rules.minLength(1),
    ]),
    performanceSecurity: schema.string.optional({ trim: true }, [rules.minLength(1)]),
    specialContractConditions: schema.string.optional({ trim: true }, [rules.minLength(1)]),
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
