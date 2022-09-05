/* eslint-disable class-methods-use-this */
import jwt from 'jsonwebtoken';
import R from 'ramda';
import {
  IAuthorizationAdapter,
  User,
} from '../interfaces/authorization.adapter';

export class JwtAuthorizationAdapter implements IAuthorizationAdapter {
  #secret: string;

  constructor(params: { secret: string }) {
    this.#secret = params.secret;
  }

  async authorize(params: {
    header: Record<string, string>;
  }): Promise<User | null> {
    const { authorization } = params.header;

    if (R.isNil(authorization)) {
      return null;
    }

    const [, token] = authorization.split(' ');
    const payload = jwt.verify(token, this.#secret);

    return { id: payload.sub as string };
  }
}
