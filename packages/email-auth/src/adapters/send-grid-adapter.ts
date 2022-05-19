import sgMail, { MailDataRequired } from '@sendgrid/mail';

import { EmailableProviderAdapter } from '../interfaces/emailable-provider-adapter';

type SenderInfo = {
  name: string;
  email: string;
};

export class SendGridAdapter implements EmailableProviderAdapter<MailDataRequired, sgMail.ClientResponse> {
  public readonly emailProvider = sgMail;

  private readonly senderInfo: SenderInfo;

  constructor(params: {
    from: SenderInfo;
  }) {
    this.senderInfo = params.from;
  }

  setApiKey(key: string): void {
    this.emailProvider.setApiKey(key);
  }

  async sendEmail(message: MailDataRequired) {
    const msg = {
      ...message,
      from: this.senderInfo,
    };

    const [result] = await this.emailProvider.send(message);

    return result;
  }

  get senderEmail() {
    return this.senderInfo.email;
  }

  get senderName() {
    return this.senderInfo.name || 'no-reply';
  }
}
