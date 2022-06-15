import { sign } from 'jsonwebtoken';

export function generateToken(params: {
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