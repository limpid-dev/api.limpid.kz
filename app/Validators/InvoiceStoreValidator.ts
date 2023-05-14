import { rules, schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class InvoiceStoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number.optional([rules.range(100000, 999999)]),
    amount: schema.number.optional([rules.range(1, 999999)]),
    planId: schema.number.optional([rules.exists({ table: 'sub_plans', column: 'id' })]),
    userId: schema.number.optional([rules.exists({ table: 'users', column: 'id' })]),
    currency: schema.string.optional({ trim: true }, [rules.minLength(1), rules.maxLength(1024)]),
    description: schema.string.optional({ trim: true }, [rules.minLength(1), rules.maxLength(102400)]),
    postLink: schema.string.optional({ trim: true }, [rules.minLength(1), rules.maxLength(10000)]),
    language: schema.string.optional({ trim: true }, [rules.minLength(1), rules.maxLength(1024)]),
    terminal: schema.string.optional({ trim: true }, [rules.minLength(1), rules.maxLength(1024)]),
  })

  public messages: CustomMessages = {}
}
