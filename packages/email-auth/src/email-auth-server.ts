import parse from 'co-body';
import { EmailAdapter, StorageAdapter } from './interfaces';
import cryptoRandomString from 'crypto-random-string';
import jsonwebtoken from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export class EmailAuthServer {
  constructor(
    private storageAdapter: StorageAdapter,
    private emailAdapter: EmailAdapter,
    private opts?: {
      jwtSecret?: string;
      jwtTTL?: string;
      otpTTL?: string;
      urlPrefix?: string;
    },
  ) {}

  public expressMiddleware() {
    const { storageAdapter, emailAdapter, opts } = this;
    return async function(req: Request, res: Response, next: NextFunction) {
      const url = new URL(
        req.url!,
        `${!req.headers.host!.startsWith('https://') ? 'https://' : ''}${
          req.headers.host
        }`,
      );
  
      if (
        opts?.urlPrefix &&
        !url.pathname.startsWith(opts?.urlPrefix)
      ) {
        return;
      }
  
      if (
        req.method === 'POST' &&
        `${opts?.urlPrefix ? opts?.urlPrefix : ''}/otp/generate` ===
          url.pathname
      ) {
        const body = await parse.json(req);
  
        const user = await storageAdapter.findOneUserByEmail({
          emailAddress: body.emailAddress,
        });
  
        if (!user) {
          res.writeHead(400, {
            'Content-Type': 'application/json',
          });
          res.end(
            JSON.stringify({
              error: {
                code: 'USER_NOT_FOUND',
                message: 'user with the specified email address does not exist.',
              },
            }),
          );
  
          return;
        }
  
        const otp = cryptoRandomString({
          length: 6,
          type: 'numeric',
        });
  
        await storageAdapter.saveOtp({
          user: user.id,
          otp,
        });
  
        await emailAdapter.sendEmailOtp({
          otp,
          user,
        });
  
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
  
        return;
      }
  
      if (
        req.method === 'POST' &&
        `${opts?.urlPrefix ? opts?.urlPrefix : ''}/otp/validate` ===
          url.pathname
      ) {
        const body = await parse.json(req);
        const user = await storageAdapter.validateOtp({
          otp: body.otp,
        });
  
        if (!user) {
          res.writeHead(400, {
            'Content-Type': 'application/json',
          });
          res.end(
            JSON.stringify({
              error: {
                code: 'INVALID_OTP',
                message: 'OTP is invalid.',
              },
            }),
          );
  
          return;
        } else {
          await storageAdapter.deleteOtp({
            otp: body.otp,
          });
        }
  
        const token = jsonwebtoken.sign({}, opts?.jwtSecret as string, {
          expiresIn: opts?.jwtTTL as string,
          subject: user.emailAddress,
        });
  
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(
          JSON.stringify({
            ok: true,
            token,
          }),
        );
        res.end();
  
        return;
      }
  
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end();
  
      next();
    }
  }
}
