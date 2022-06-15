import sgMail, { MailDataRequired } from '@sendgrid/mail';

import { EmailableProviderAdapter } from '../interfaces/emailable-provider-adapter';
import { SenderInfo } from '../types';

export class SendGridAdapter implements EmailableProviderAdapter<MailDataRequired, sgMail.ClientResponse> {
  public readonly emailProvider = sgMail;

  private readonly senderInfo: SenderInfo;

  constructor(params: {
    apiKey: string;
    from: SenderInfo;
  }) {
    this.setApiKey(params.apiKey);

    this.senderInfo = params.from;
  }

  setApiKey(key: string): void {
    this.emailProvider.setApiKey(key);
  }

  async sendEmail(message: MailDataRequired) {
    const [result] = await this.emailProvider.send({
      ...message,
      from: this.senderInfo,
    });

    return result;
  }

  get senderEmail() {
    return this.senderInfo.email || 'emailauth@hov.co';
  }

  get senderName() {
    return this.senderInfo.name || 'no-reply';
  }
}
