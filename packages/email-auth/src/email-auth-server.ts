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
    return async function (req: Request, res: Response, next: NextFunction) {
      const url = new URL(
        req.url!,
        `${!req.headers.host!.startsWith('https://') ? 'https://' : ''}${
          req.headers.host
        }`,
      );

      if (opts?.urlPrefix && !url.pathname.startsWith(opts?.urlPrefix)) {
        next();

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
          res.set('Content-Type', 'application/json');
          res.status(400);
          res.send({
            error: {
              code: 'USER_NOT_FOUND',
              message: 'user with the specified email address does not exist.',
            },
          });

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

        res.set('Content-Type', 'application/json');
        res.status(200);
        res.send({
          ok: true,
        });

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
          res.set('Content-Type', 'application/json');
          res.status(400);
          res.send({
            error: {
              code: 'INVALID_OTP',
              message: 'OTP is invalid.',
            },
          });

          return;
        } else {
          await storageAdapter.deleteOtp({
            otp: body.otp,
          });
        }

        const token = jsonwebtoken.sign({}, opts?.jwtSecret as string, {
          expiresIn: opts?.jwtTTL as string,
          subject: user.id.toString('base64url'),
        });

        res.set('Content-Type', 'application/json');
        res.status(200);
        res.send({
          ok: true,
          token,
        });

        return;
      }

      next();
    };
  }
  public validateJWT(token: string) {
    return jsonwebtoken.verify(token, this.opts?.jwtSecret as string);
  }
}
