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
  public async show({ request, auth }: HttpContextContract) {
    const invoiceID = Math.floor(Math.random() * Math.pow(10, 6 - 1) + Math.pow(10, 6 - 1))

    const invoice = new Invoice()

    const plans = await SubPlans.findOrFail(request.param('plan'))

    const users = await SubPlans.findOrFail(auth.user!.id)

    if (!plans.amount) {
      throw new Error(`Введите сумму`)
    }

    invoice.merge({
      id: invoiceID,
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
    formData.append('client_secret', Env.get('EPAY_CLIENT_SECRET'))
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

    const invoice = new Invoice()

    invoice.merge({
      status: 'accepted',
      payId: request.input('id'),
      id: invoiceId,
      amount: request.input('amount'),
      userId: user.id,
      postLink: Env.get('EPAY_POST_LINK'),
      planId: plan.id,
      terminal: Env.get('EPAY_TERMINAL_ID'),
      language: request.input('language'),
      description: request.input('description'),
      currency: request.input('currency'),
    })

    user.merge({
      payment_start: DateTime.now(),
      payment_end: DateTime.now().plus({ days: plan.duration }),
      projects_attempts: plan.projects_attempts,
      auctions_attempts: plan.auctions_attempts,
    })

    await user.save()

    await invoice.save()
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

    formData.append('client_secret', Env.get('EPAY_CLIENT_SECRET'))

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
      users.auctions_attempts === plan.auctions_attempts &&
      users.projects_attempts === plan.projects_attempts
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
        auctions_attempts: 0,
        projects_attempts: 0,
      })

      await invoice.save()

      await users.save()

      return data
    }
  }
}
