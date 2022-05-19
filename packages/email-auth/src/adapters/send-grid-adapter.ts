import sgMail from '@sendgrid/mail';

import { EmailableProviderAdapter } from '../types';

type SenderInfoType = {
  name: string;
  email: string;
};

export class SendGridAdapter implements EmailableProviderAdapter {
  private readonly sgMail: typeof sgMail = sgMail;

  private readonly senderInfo!: SenderInfoType;

  constructor(params: {
    sendGridApiKey: string;
    from: SenderInfoType;
  }) {
    this.setApiKey(params.sendGridApiKey);
    this.senderInfo = params.from;
  }

  setApiKey(key: string): void {
    this.sgMail.setApiKey(key);
  }

  async sendEmail<MailDataRequired, ClientResponse>(message: MailDataRequired): Promise<ClientResponse> {
    const msg = {
      from: this.senderInfo,
      ...message,
    };
    const result = await this.sgMail.send(msg as never).catch((e) => console.error(e.response.body.errors));

    return result as never;
  }

  get senderEmail() {
    return this.senderInfo.email;
  }

  get senderName() {
    return this.senderInfo.name;
  }
}
