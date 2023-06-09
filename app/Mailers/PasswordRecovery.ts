import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'

export default class PasswordRecovery extends BaseMailer {
  constructor(private readonly user: User, private readonly token: string) {
    super()
  }
  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  // public mailer = this.mail.use()

  /**
   * The prepare method is invoked automatically when you run
   * "PasswordRecovery.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public prepare(message: MessageContract) {
    message
      .subject('Восстановление пароля')
      .from(Env.get('SMTP_USERNAME'))
      .to(this.user.email)
      .text(`Ваш код: ${this.token}`)
  }
}
