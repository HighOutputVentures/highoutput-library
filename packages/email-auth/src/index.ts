import http from 'http';
import { sign } from 'jsonwebtoken';

import { OTPOptions } from './types';
import { PersistenceAdapter } from './interfaces/persistence-adapter';
import { EmailableProviderAdapter } from './interfaces/emailable-provider-adapter';

export type MessageDetails = {
  to: string;
  from: {
    name: string;
    email: string;
  },
  subject: string;
  text: string;
};

const THIRY_SECONDS = 30_000;

export function generateToken(params: {
  expiryDuration: number;
  payload: {
    id: Buffer;
    subject: Buffer;
  };
  secret: string;
}) {
  return sign(params.payload, params.secret, {
    subject: params.payload.subject.toString('base64'),
    expiresIn: '60d',
  });
}

function getReqData(request: http.IncomingMessage): any {
  return new Promise((resolve, reject) => {
      try {
          let body = '';
          
          request.on('data', (chunk: any) => {
              body += chunk.toString();
          });
          
          request.on('end', () => {
              resolve(body);
          });
      } catch (error) {
          reject(error);
      }
  });
}

export class EmailAuthentication {
  private readonly server: http.Server;

  private readonly persistenceAdapter: PersistenceAdapter;

  private readonly emailProviderAdapter: EmailableProviderAdapter;

  private readonly emailProviderApiKey: string;

  private readonly otpExpiryDuration: number;

  constructor(options: {
    server: http.Server;

    persistenceAdapter: PersistenceAdapter;

    emailProviderAdapter: EmailableProviderAdapter;

    emailProviderApiKey: string;

    otpExpiryDuration?: number;

    emailTemplate?: any;
  }) {
    this.server = options.server;

    this.persistenceAdapter = options.persistenceAdapter;

    this.emailProviderAdapter = options.emailProviderAdapter;

    this.emailProviderApiKey = options.emailProviderApiKey;

    this.otpExpiryDuration = options.otpExpiryDuration || THIRY_SECONDS;

    this.emailProviderAdapter.setApiKey(this.emailProviderApiKey);
  }

  use() {
    this.server
      .on('request', async (request, response) => {
        if (request.method === 'POST') {
          if (request.url === '/generateOtp') {
            const body = JSON.parse(await getReqData(request));
            
            if (!body.message.to) {
              response.writeHead(400, { 'Content-Type': 'application/json' });
              response.end(JSON.stringify({
                message: '`to` should be supplied',
              }));

              return;
            } 

            const user = await this.persistenceAdapter.findOneUserByEmail({ email: body.message.to });

            if (!user) {
              response.writeHead(400, { 'Content-Type': 'application/json' });
              response.end(JSON.stringify({
                message: '`email` is invalid',
              }));

              return;
            }

            const previousOtp = await this.persistenceAdapter.findOneEmailOtp({ user: user._id });

            if (previousOtp) {
              const previousTime = previousOtp.createdAt.getTime()
              const currentTime = new Date().getTime();

              if (currentTime - (previousTime || 0) < this.otpExpiryDuration) {
                response.writeHead(400, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({
                  message: `cannot generate another otp within ${this.otpExpiryDuration}ms`,
                }));

                return;
              }
            }
            
            const otpDocument = await this.persistenceAdapter.createEmailOtp({
              data: { user: user._id },
            });

            
            const message = {
              to: body.message.to,
              from: {
                email: this.emailProviderAdapter.senderEmail,
                name: this.emailProviderAdapter.senderName || 'no-reply',
              },
              subject: 'otp authorization',
              text: `${otpDocument.otp}`,
            };
            
            await this.emailProviderAdapter.sendEmail(message);

            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({
              message: 'email sent',
              data: {},
            }));

            return;
          } else if (request.url === '/validateOtp') {
            const body = JSON.parse(await getReqData(request));

            if (!body.email) {
              response.writeHead(404, { 'Content-Type': 'application/json' });
              response.end(JSON.stringify({
                message: '`email` should be provided',
              }));

              return;
            } else if (!body.otp) {
              response.writeHead(404, { 'Content-Type': 'application/json' });
              response.end(JSON.stringify({
                message: '`otp` should be provided',
              }));

              return;
            }

            const user = await this.persistenceAdapter.findOneUserByEmail({ email: body.email });

            if (!user) {
              response.writeHead(400, { 'Content-Type': 'application/json' });
              response.end(JSON.stringify({
                message: '`email` is invalid',
              }));
            }

            const otp = await this.persistenceAdapter.findOneEmailOtp({ user: user._id, otp: body.otp });
            
            if (!otp) {
              response.writeHead(404, { 'Content-Type': 'application/json' });
              response.end(JSON.stringify({
                message: 'invalid `otp` or `email`',
              }));

              return;
            }

            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({
              token: `Bearer ${generateToken({
                expiryDuration: 30_000,
                payload: {
                  subject: Buffer.from('1', 'base64'),
                  id: Buffer.from('1', 'base64'),
                },
                secret: 'SECRET',
              })}`,
            }));
            
            await this.persistenceAdapter.deleteRelatedOtps({ user: user._id });

            return;
          }
        }

        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: 'not found' }));

        return;
      });
  }
}
