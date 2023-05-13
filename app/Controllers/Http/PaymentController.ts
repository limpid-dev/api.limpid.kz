import fetch from 'node-fetch'
import Env from '@ioc:Adonis/Core/Env'
import FormData from 'form-data'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import SubPlans from 'App/Models/SubPlans'
import Invoice from 'App/Models/Invoice'
import InvoiceStoreValidator from 'App/Validators/InvoiceStoreValidator'
import { bind } from '@adonisjs/route-model-binding'
import { DateTime } from 'luxon'

export default class PaymentController {

  public async paymentToken({request, auth}: HttpContextContract) {
    const user = auth.user!
    const payload = await request.validate(InvoiceStoreValidator)
    const plan = await SubPlans.findOrFail(payload.planId);
    var invoiceID = Math.floor(Math.random() * (Math.pow(10, 6 - 1)) + Math.pow(10, 6 - 1));
    const amount = plan.amount;
    if (!amount) {
      return { message: 'Сумма не найдена' }
    }
    payload.id = invoiceID;
    payload.amount = amount;
    payload.userId = user.id;
    payload.currency = 'KZT';
    payload.description = 'Оплата тарифного плана';
    payload.postLink = 'https://example.kz/';
    payload.language = 'rus';
    payload.terminal = Env.get('EPAY_TERMINAL_ID');

    let formData = new FormData();
    formData.append('grant_type', 'client_credentials');
    formData.append('amount', payload.amount);
    formData.append('currency', payload.currency);
    formData.append('client_id', Env.get('EPAY_CLIENT_ID'));
    formData.append('client_secret', '8VPL0#e$by)ZLigx');
    formData.append('terminal', Env.get('EPAY_TERMINAL_ID'));
    formData.append('invoiceID', invoiceID);
    formData.append('scope', 'webapi usermanagement email_send verification statement statistics payment');
    formData.append('postLink', payload.postLink);

  const url = 'https://epay-oauth.homebank.kz/oauth2/token'

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    console.log(data);
    
    const payment = await Invoice.create(payload)
    return {data, payment};
  } catch (error) {
    console.error(error);
    throw new Error("Не удалось обратиться к банку по получению токена");
  }
  }

  @bind()
  public async checkPaymentStatusAccepted ({ request }: HttpContextContract) {
    const id = request.input('accountId');
    const invoiceId = request.input('invoiceId');
    const invoice = await Invoice.findOrFail(invoiceId);
    const plan = await SubPlans.findOrFail(invoice.planId);
    const newUser = await User.findOrFail(id);

    invoice.status = 'accepted';
    newUser.payment_start = DateTime.now();
    newUser.payment_end = DateTime.now().plus({days: plan.duration})
    newUser.projects_atmpts = newUser.projects_atmpts + plan.projects_atmpts
    newUser.auction_atmpts = newUser.auction_atmpts + plan.auction_atmpts
    await newUser.save()
    await invoice.save()
  }

  @bind()
  public async checkPaymentStatusFailed ({ request }: HttpContextContract) {
    const invoiceId = request.input('invoiceId');
    const invoice = await Invoice.findOrFail(invoiceId);
    invoice.status = 'refused';
    await invoice.save()
  }
}