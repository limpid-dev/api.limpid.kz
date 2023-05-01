import Browser from '@ioc:Browser'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TechnicalTaskServiceValidator from 'App/Validators/Templates/TechnicalTaskServiceValidator'

type Constructor = new (...args: any[]) => any

const templates: Record<string, { view: string; validator: Constructor }> = {
  'technical-task-service': {
    view: 'technical-task-service',
    validator: TechnicalTaskServiceValidator,
  },
}

export default class TemplatesController {
  public async show({ view, request, params: { template }, response }: HttpContextContract) {
    const payload = await request.validate(templates[template].validator)

    const html = await view.render(templates[template].view, payload)

    const page = await Browser.newPage()

    await page.setContent(html)
    await page.emulateMediaType('screen')

    const pdf = await page.pdf({
      format: 'a4',
      margin: { top: '64px', left: '48px' },
    })

    await page.close()

    response.header('Content-type', 'application/pdf')
    response.header('Content-Disposition', 'attachment; filename=attachment.pdf')

    return pdf
  }
}
