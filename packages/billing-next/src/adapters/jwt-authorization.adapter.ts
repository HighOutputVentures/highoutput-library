/* eslint-disable class-methods-use-this */
import {
  IAuthorizationAdapter,
  User,
} from '../interfaces/authorization.adapter';

export class JwtAuthorizationAdapter implements IAuthorizationAdapter {
  #secret: string;

  constructor(params: { secret: string }) {
    this.#secret = params.secret;
  }

  async authorize(_params: {
    header: Record<string, string>;
  }): Promise<User | null> {
    // extract JWT from the Authorization header
    // validate JWT using the provided secret
    // sub is the user id
    return null;
  }
}
