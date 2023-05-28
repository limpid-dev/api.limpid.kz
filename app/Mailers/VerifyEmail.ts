import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'

export default class VerifyEmail extends BaseMailer {
  constructor(private user: User, private token: string) {
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
   * "VerifyEmail.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public prepare(message: MessageContract) {
    message
      .subject('Limpid | Подтверждение почты')
      .from('noreply@limpid.com')
      .to(this.user.email)
      .htmlView('emails/email-verification', { token: this.token })
  }
}
