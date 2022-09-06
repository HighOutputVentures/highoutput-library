import jwt from 'jsonwebtoken';

type Payload = {
  sub: string;
} & Record<string, string>;

export function generateToken(payload: Payload, secret: string) {
  return jwt.sign(payload, secret);
}
