import { sign } from 'jsonwebtoken';
import R from 'ramda';
import { Context, Next } from 'koa';
import mongoose, { Connection } from 'mongoose';

import { MongooseAdapter } from './mongoose-adapter';
import { SendGridAdapter } from './send-grid-adapter';
import {
  FrameworkType,
  OtpType,
  EmailableProvider,
  StorageProvider,
  Email,
} from './types';

type MessageType = {
  to: Email;
  subject: string;
  body: string;
  html?: string;
};

export class EmailAuthentication {
  private static readonly THIRTY_SECONDS = 30 * 1000;

  private readonly mongooose: Connection = mongoose.connection;

  private storageAdapter!: StorageProvider;

  private providerAdapter!: EmailableProvider;

  private readonly framework: FrameworkType;

  private readonly otp: OtpType;

  constructor(options: {
    framework: FrameworkType;
    otp: OtpType;
    storageAdapter?: StorageProvider;
    providerAdapter: {
      apiKey: string;
      from: {
        name: string;
        email: Email;
      };
    };
  }) {
    this.providerAdapter = new SendGridAdapter({
      from: options.providerAdapter.from,
      sendGridApiKey: options.providerAdapter.apiKey,
    });
    this.storageAdapter = new MongooseAdapter(this.mongooose);
    this.framework = options.framework;
    this.otp = options.otp;
  }

  middleware() {
    if (this.framework === 'koa') {
      return async (ctx: Context, next: Next) => {
        const { state, request, header } = ctx;

        state.emailAuthentication = {
          sendEmail: async (message: MessageType) => {
            const otp = await this.storageAdapter.create({
              data: { email: message.to },
            });

            const msg = {
              text: `${otp.otp}`.concat(`\n ${message.body}`),
              ...R.omit(['body'])(message),
            };

            return this.providerAdapter.sendEmail(msg);
          },

          authenticate: async () => {
            const { body } = request;

            if (!body.email && !body.otp) {
              ctx.throw(401, 'Authentication Error');
            }

            const otp = await this.storageAdapter.find({
              filter: { email: body.email, otp: body.otp },
              options: { sort: { createdAt: -1 } },
            });

            if (!otp || !(otp.length !== 0)) {
              ctx.throw(401, 'Authentication Error');
            }

            header.authorization = 'Bearer '.concat(
              this.#generateToken(this.otp),
            );
          },
        };

        return next();
      };
    }
    return async (ctx: Context, next: Next) => next();
  }

  #generateToken(params: {
    expiryDuration: string;
    payload: {
      id: Buffer;
      subject: Buffer;
    };
    secret: string;
  }) {
    return sign(params.payload, params.secret, {
      subject: params.payload.subject.toString('base64'),
      expiresIn: params.expiryDuration || EmailAuthentication.THIRTY_SECONDS,
    });
  }
}
