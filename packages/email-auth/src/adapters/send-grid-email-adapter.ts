import SendGrid from '@sendgrid/mail';
import ejs, { TemplateFunction } from 'ejs';
import { EmailAdapter } from '../interfaces';
import { User } from '../lib/types';

export class SendGridEmailAdapter implements EmailAdapter {
  private template: TemplateFunction;
  constructor(private opts: {
    apiKey: string;
    sender: string;
    subject: string;
    template: string;
  }) {
    this.template = ejs.compile(this.opts.template)
  }

  async sendEmailOtp(params: { otp: string; user: User }) {
    SendGrid.setApiKey(this.opts.apiKey);

    await SendGrid.send({
      to: params.user.emailAddress,
      text: this.template(params),
      subject: this.opts.subject,
      from: this.opts.sender,
    });
  }
}
