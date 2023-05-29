import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { pipe, gotenberg, convert, html, please, adjust } from 'gotenberg-js-client'
import StoreValidator from 'App/Validators/Templates/StoreValidator'
import createTemplate from '../../../resources/js/Template'

export default class TemplatesController {
  public async create({ request, response }: HttpContextContract) {
    const payload = await request.validate(StoreValidator)
    const htmlContent = createTemplate(payload)
    try {
      const toPDF = pipe(
          gotenberg(''),
          convert,
          html,
          adjust({
            url: 'http://localhost:7000/forms/libreoffice/convert',
          }),
          please
        )
        const pdf = await toPDF(htmlContent)
        const newpdf = response.stream(pdf)
        response.header('Content-type', 'application/pdf')
        response.header('Content-Disposition', 'attachment; filename=attachment.pdf')
        return newpdf
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }
}