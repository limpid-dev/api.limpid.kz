import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { pipe, gotenberg, convert, html, please, adjust } from 'gotenberg-js-client'
import StoreValidator from 'App/Validators/Templates/StoreValidator'
import Env from '@ioc:Adonis/Core/Env'

export default class TemplatesController {
  public async store({ view, request, response }: HttpContextContract) {

    const payload = await request.validate(StoreValidator)

    const htmlContent = await view.render('template-generate', payload)

      const toPDF = pipe(
        gotenberg(''),
        convert,
        html,
        adjust({
          url: Env.get('GOTENBERG_URL'),
        }),
        please
      )

      const pdf = await toPDF(htmlContent)

      const newpdf = response.stream(pdf)

      response.header('Content-type', 'application/pdf')
      response.header('Content-Disposition', 'attachment; filename=attachment.pdf')
      return newpdf
    }
  }