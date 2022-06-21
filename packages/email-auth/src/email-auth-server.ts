import { Server } from 'http';
import parse from 'co-body';
import { EmailAdapter, StorageAdapter } from './interfaces';

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
    }
  ) {

  }

  async init() {
    this.server
      .on('request', async (req, res) => {
        const url = new URL(req.url!);

        if (this.opts?.urlPrefix && !url.pathname.startsWith(this.opts?.urlPrefix)) {
          return;
        }

        if (req.method === 'POST' && `${this.opts?.urlPrefix}/otp/generate` === url.pathname) {
          const body = await parse.json(req);

          return;
        }

        if (req.method === 'POST' && `${this.opts?.urlPrefix}/otp/validate` === url.pathname) {
          return;
        }
      });
  }
}