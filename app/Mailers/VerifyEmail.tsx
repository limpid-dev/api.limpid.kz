import { renderAsync } from '@react-email/render'
import Env from '@ioc:Adonis/Core/Env'
import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import { Email } from '../../emails/verify'
import React from 'react'

export default class VerifyEmail extends BaseMailer {
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
   * "VerifyEmail.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public async prepare(message: MessageContract) {
    const html = await renderAsync(<Email />)

    message
      .subject('Email verification')
      .from(Env.get('SMTP_USERNAME'))
      .to(this.user.email)
      .html(html)
  }
}
