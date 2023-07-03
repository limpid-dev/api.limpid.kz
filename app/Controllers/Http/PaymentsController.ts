import fetch from 'node-fetch'
import Env from '@ioc:Adonis/Core/Env'
import FormData from 'form-data'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import SubPlans from 'App/Models/SubPlans'
import Invoice from 'App/Models/Invoice'
import { bind } from '@adonisjs/route-model-binding'
import { DateTime } from 'luxon'

export default class PaymentsController {
  public async index({ auth }: HttpContextContract) {
    const userInfo = await Invoice.query()
      .where('userId', auth.user!.id)
      .where('status', 'accepted')
      .preload('users')
      .firstOrFail()

    return userInfo
  }

  public async show({ request, auth }: HttpContextContract) {
    const invoiceID = DateTime.local().toMillis()

    const invoice = new Invoice()

    const plans = await SubPlans.findOrFail(request.param('plan'))

    const users = await SubPlans.findOrFail(auth.user!.id)

    if (!plans.amount) {
      throw new Error(`Введите сумму`)
    }

    invoice.merge({
      invoiceId: invoiceID,
      amount: plans.amount,
      userId: users.id,
      postLink: Env.get('EPAY_POST_LINK'),
      planId: plans.id,
      terminal: Env.get('EPAY_TERMINAL_ID'),
      language: 'rus',
      description: 'Оплата подписки на Lim',
      currency: 'KZT',
    })

    const formData = new FormData()
    formData.append('grant_type', 'client_credentials')
    formData.append('amount', plans.amount)
    formData.append('currency', 'KZT')
    formData.append('client_id', Env.get('EPAY_CLIENT_ID'))
    formData.append('client_secret', '8VPL0#e$by)ZLigx')
    formData.append('terminal', Env.get('EPAY_TERMINAL_ID'))
    formData.append('invoiceID', invoiceID)
    formData.append(
      'scope',
      'webapi usermanagement email_send verification statement statistics payment'
    )
    formData.append('postLink', Env.get('EPAY_POST_LINK'))

    const response = await fetch(Env.get('EPAY_TOKEN_URL'), {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    return { data, invoice }
  }

  @bind()
  public async store({ request }: HttpContextContract) {
    const id = request.input('accountId')

    const invoiceId = request.input('invoiceId')

    const plan = await SubPlans.query().where('amount', request.input('amount')).firstOrFail()

    const user = await User.findOrFail(id)

    //const token = await this.webKassaToken()

    const invoice = new Invoice()

    const data = {
      Token: Env.get('WEBKASSA_TOKEN'),
      CashboxUniqueNumber: Env.get('WEBKASSA_UNIQUE_NUMBER'),
      OperationType: 2,
      Positions: [
        {
          Count: 1,
          Price: request.input('amount'),
          TaxPercent: null,
          Tax: 0,
          TaxType: 0,
          PositionName: invoice.description,
          UnitCode: 796,
          GTIN: 0,
          ProductId: plan.id,
        },
      ],
      Payments: [
        {
          Sum: request.input('amount'),
          PaymentType: 1,
        },
      ],
      Change: 0,
      RoundType: 2,
      ExternalCheckNumber: request.input('invoiceId'),
      CustomerEmail: user.email,
    }

    const response = await fetch(Env.get('WEBKASSA_CHECK_URL'), {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': Env.get('WEBKASSA_API_KEY'),
      },
    })

    const check = await response.json()

    //console.log(check)

    invoice.merge({
      status: 'accepted',
      payId: request.input('id'),
      invoiceId: invoiceId,
      amount: request.input('amount'),
      userId: user.id,
      postLink: Env.get('EPAY_POST_LINK'),
      planId: plan.id,
      terminal: Env.get('EPAY_TERMINAL_ID'),
      language: request.input('language'),
      description: request.input('description'),
      currency: request.input('currency'),
      checkUrl: check.Data.TicketUrl,
    })

    user.merge({
      planId: plan.id,
      paymentStart: DateTime.now(),
      paymentEnd: DateTime.now().plus({ days: plan.duration }),
      projectsAttempts: plan.projectsAttempts,
      auctionsAttempts: plan.auctionsAttempts,
    })

    await user.save()

    await invoice.save()
  }

  public async webKassaToken() {
    const request = {
      Login: Env.get('WEBKASSA_LOGIN'),
      Password: Env.get('WEBKASSA_PASSWORD'),
    }
    try {
      const response = await fetch(Env.get('WEBKASSA_TOKEN_URL'), {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'WK-F4B2AC0E-6BE5-49BA-A1DB-D9E58FC75346',
        },
      })

      const data = await response.json()

      return data
    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  private async cancelPaymentToken(id: number) {
    const invoice = await Invoice.query()
      .where('userId', id)
      .where('status', 'accepted')
      .preload('users')
      .firstOrFail()

    let formData = new FormData()

    formData.append('grant_type', 'client_credentials')

    formData.append(
      'scope',
      'webapi usermanagement email_send verification statement statistics payment'
    )

    formData.append('client_id', Env.get('EPAY_CLIENT_ID'))

    formData.append('client_secret', '8VPL0#e$by)ZLigx')

    const response = await fetch(Env.get('EPAY_TOKEN_URL'), {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    invoice.merge({
      cancelToken: data.access_token,
    })

    await invoice.save()

    return data
  }

  @bind()
  public async destroy({ auth }: HttpContextContract) {
    const user = auth.user!.id

    await this.cancelPaymentToken(user)

    const users = await User.findOrFail(user)

    const invoice = await Invoice.query()
      .where('userId', user)
      .where('status', 'accepted')
      .preload('users')
      .firstOrFail()

    const payId = invoice.payId

    const plan = await SubPlans.findOrFail(invoice.planId)

    const token = invoice.cancelToken

    const headers = {
      Authorization: `Bearer ${token}`,
    }

    if (
      users.auctionsAttempts === plan.auctionsAttempts &&
      users.projectsAttempts === plan.projectsAttempts
    ) {
      const url = `https://epay-api.homebank.kz/operation/${payId}/refund`

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
      })

      const data = await response.json()

      invoice.merge({
        status: 'canceled',
      })

      users.merge({
        auctionsAttempts: 0,
        projectsAttempts: 0,
      })

      //const tokenCheck = await this.webKassaToken()

      const dataCheck = {
        Token: Env.get('WEBKASSA_TOKEN'),
        CashboxUniqueNumber: Env.get('WEBKASSA_UNIQUE_NUMBER'),
        OperationType: 3,
        Positions: [
          {
            Count: 1,
            Price: plan.amount,
            TaxPercent: 0,
            Tax: 0,
            TaxType: 0,
            PositionName: 'Возврат платежа по подписке',
            UnitCode: 796,
            GTIN: 0,
            ProductId: plan.id,
          },
        ],
        Payments: [
          {
            Sum: invoice.amount,
            PaymentType: 1,
          },
        ],
        Change: 0,
        RoundType: 2,
        ExternalCheckNumber: invoice.payId,
        CustomerEmail: users.email,
      }

      const res = await fetch(Env.get('WEBKASSA_CHECK_URL'), {
        method: 'POST',
        body: JSON.stringify(dataCheck),
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': Env.get('WEBKASSA_API_KEY'),
        },
      })

      const check = await res.json()

      console.log(check)

      await invoice.save()

      await users.save()

      return data
    }
  }
}
