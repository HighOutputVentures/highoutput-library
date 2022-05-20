import http from 'http';

import { PersistenceAdapter } from '../interfaces';
import { getRequestData } from './get-request-data';
import { generateToken as generateTokenLib } from './generate-token';


export const validateOtp = async (
  request: http.IncomingMessage,
  response: http.ServerResponse,
  serializeRequest: typeof getRequestData,
  persistenceAdapter: PersistenceAdapter,
  otpExpiryDuration: number,
  jwtSecretKey: string,
  generateToken: typeof generateTokenLib,
) => {
  const body = JSON.parse(await serializeRequest(request));

  if (!body.email) {
    response.writeHead(400, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({
      message: '`email` should be provided',
    }));

    return;
  } else if (!body.otp) {
    response.writeHead(400, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({
      message: '`otp` should be provided',
    }));

    return;
  }

  const user = await persistenceAdapter.findOneUserByEmail({ email: body.email });

  if (!user) {
    response.writeHead(400, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({
      message: '`email` is invalid',
    }));

    return;
  }

  const otp = await persistenceAdapter.findOneEmailOtp({ user: user._id, otp: body.otp });
  
  if (!otp) {
    response.writeHead(400, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({
      message: 'invalid `otp` or `email`',
    }));

    return;
  }

  const previousTime = otp.createdAt.getTime()
  const currentTime = new Date().getTime();

  if ((currentTime - previousTime) > otpExpiryDuration) {
    response.writeHead(400, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({
      message: `otp already past ${otpExpiryDuration}ms`,
    }));

    return;
  }

  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({
    token: `Bearer ${generateToken({
      payload: {
        subject: user._id,
        id: user._id,
      },
      secret: jwtSecretKey,
    })}`,
  }));
  
  await persistenceAdapter.deleteRelatedOtps({ user: user._id });

  return;
}