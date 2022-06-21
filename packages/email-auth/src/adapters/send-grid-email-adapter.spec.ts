import { SendGridEmailAdapter } from './send-grid-email-adapter';
import Chance from 'chance';
import cryptoRandomString from 'crypto-random-string';
import { MailService } from '@sendgrid/mail';

const chance = new Chance();
type Context = {
  sendGridEmailAdapter: SendGridEmailAdapter;
};

describe('SendGridEmailAdapter', () => {
  beforeEach(async function (this: Context) {
    this.sendGridEmailAdapter = new SendGridEmailAdapter({
      apiKey: `SG.${chance.apple_token()}`,
      senderInfo: {
        email: chance.email(),
        name: chance.name(),
      },
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  describe('#sendEmailOtp', () => {
    it('should send email otp', async function (this: Context) {
      const sendSpy = jest
        .spyOn(MailService.prototype, 'send')
        .mockImplementation(async () => {
          return [
            {
              statusCode: 200,
              body: { ok: true },
              headers: {
                'Content-Type': 'application/json',
              },
            },
            {},
          ];
        });

      await expect(
        this.sendGridEmailAdapter.sendEmailOtp({
          otp: cryptoRandomString({
            length: 6,
            type: 'numeric',
          }),
          user: {
            emailAddress: chance.email(),
            id: Buffer.from('1'),
          },
        }),
      ).resolves.not.toThrow();

      expect(sendSpy).toBeCalledTimes(1);
    });
  });
});
