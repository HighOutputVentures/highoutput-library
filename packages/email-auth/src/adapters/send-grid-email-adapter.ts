import sgMail from '@sendgrid/mail';
import { EmailAdapter } from '../interfaces';
import { User } from '../lib/types';
import { SenderInfo } from '../types';

export class SendGridEmailAdapter implements EmailAdapter {
  private sendGridMail = sgMail;
  private readonly senderInfo: SenderInfo;
  constructor(params: { apiKey: string; senderInfo: SenderInfo }) {
    this.sendGridMail.setApiKey(params.apiKey);
    this.senderInfo = params.senderInfo;
  }

  async sendEmailOtp(params: { otp: string; user: User }) {
    await this.sendGridMail.send({
      to: params.user.emailAddress,
      text: params.otp,
      subject: 'Email Otp',
      from: this.senderInfo.email || 'test@hov.co',
    });
  }
}
