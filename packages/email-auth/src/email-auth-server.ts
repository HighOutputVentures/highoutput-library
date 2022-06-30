import { Server } from 'http';
import parse from 'co-body';
import { EmailAdapter, StorageAdapter } from './interfaces';
import cryptoRandomString from 'crypto-random-string';

export class EmailAuthServer {
  constructor(
    private server: Server,
    private storageAdapter: StorageAdapter,
    private emailAdapter: EmailAdapter,
    private opts?: {
      jwtSecret?: string;
      jwtTTL?: string;
      otpTTL?: string;
      urlPrefix?: string;
    },
  ) {}

  async init() {
    this.server.on('request', async (req, res) => {
      const url = new URL(req.url!, `http://${req.headers.host}`);

      if (
        this.opts?.urlPrefix &&
        !url.pathname.startsWith(this.opts?.urlPrefix)
      ) {
        return;
      }

      if (
        req.method === 'POST' &&
        `${this.opts?.urlPrefix ? this.opts?.urlPrefix : ''}/otp/generate` ===
          url.pathname
      ) {
        const body = await parse.json(req);

        const user = await this.storageAdapter.findOneUserByEmail({
          emailAddress: body.emailAddress,
        });

        if (!user) {
          res.writeHead(400, {
            'Content-Type': 'application/json'
          });
          res.end(JSON.stringify({
            error: {
              code: 'USER_NOT_FOUND',
              message: 'user with the specified email address does not exist'
            }
          }));

          return;
        }

        const otp = cryptoRandomString({
          length: 6,
          type: 'numeric',
        });

        await this.storageAdapter.saveOtp({
          user: user.id,
          otp,
        });

        await this.emailAdapter.sendEmailOtp({
          otp,
          user,
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));

        return;
      }

      if (
        req.method === 'POST' &&
        `${this.opts?.urlPrefix}/otp/validate` === url.pathname
      ) {
        return;
      }

      console.log('REACHED END');
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end();
    });
  }
}
