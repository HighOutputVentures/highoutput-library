import http from 'http';

import { PersistenceAdapter } from '../interfaces/persistence-adapter';
import { EmailableProviderAdapter } from '../interfaces/emailable-provider-adapter';
import { generateOtp } from './generate-otp';
import { validateOtp } from './validate-otp';

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



export class EmailAuthentication {
  private readonly server: http.Server;

  private readonly persistenceAdapter: PersistenceAdapter;

  private readonly emailProviderAdapter: EmailableProviderAdapter;

  private readonly jwtSecretKey: string;

  private readonly otpExpiryDuration: number;

  constructor(options: {
    server: http.Server;

    persistenceAdapter: PersistenceAdapter;

    emailProviderAdapter: EmailableProviderAdapter;

    jwtSecretKey: string;

    otpExpiryDuration?: number;

    emailTemplate?: any;
  }) {
    this.server = options.server;

    this.persistenceAdapter = options.persistenceAdapter;

    this.emailProviderAdapter = options.emailProviderAdapter;

    this.jwtSecretKey = options.jwtSecretKey;

    this.otpExpiryDuration = options.otpExpiryDuration || THIRY_SECONDS;
  }

  use() {
    this.server
      .on('request', async (request, response) => {
        if (request.method === 'POST') {
          if (request.url === '/generateOtp') {
            generateOtp(
              request,
              response,
              this.persistenceAdapter,
              this.emailProviderAdapter,
              this.otpExpiryDuration
            );

            return;
          } else if (request.url === '/validateOtp') {
            validateOtp(
              request,
              response,
              this.persistenceAdapter,
              this.otpExpiryDuration,
              this.jwtSecretKey,
            );

            return;
          }
        }

        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: 'not found' }));

        return;
      });
  }
}
