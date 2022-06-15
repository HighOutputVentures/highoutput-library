import http from 'http';

import { EmailableProviderAdapter, PersistenceAdapter } from '../interfaces';
import { getRequestData } from './get-request-data';

export const generateOtp = async (
  request: http.IncomingMessage,
  response: http.ServerResponse,
  seralizeRequest: typeof getRequestData,
  persistenceAdapter: PersistenceAdapter,
  emailProviderAdapter: EmailableProviderAdapter,
  otpExpiryDuration: number,
) => {
  const body = JSON.parse(await seralizeRequest(request));
            
  if (!body.message.to) {
    response.writeHead(400, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({
      message: '`to` should be supplied',
    }));

    return;
  } 

  const user = await persistenceAdapter.findOneUserByEmail({ email: body.message.to });

  if (!user) {
    response.writeHead(400, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({
      message: '`email` is invalid',
    }));

    return;
  }

  const previousOtp = await persistenceAdapter.findOneEmailOtp({ user: user._id });

  if (previousOtp) {
    const previousTime = previousOtp.createdAt.getTime()
    const currentTime = new Date().getTime();

    if ((currentTime - previousTime) < otpExpiryDuration) {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({
        message: `cannot generate another otp within ${otpExpiryDuration}ms`,
      }));

      return;
    }
  }

  const otpDocument = await persistenceAdapter.createEmailOtp({
    data: { user: user._id, createdAt: new Date() },
  });

  await emailProviderAdapter.sendEmail({
    to: body.message.to,
    from: {
      email: emailProviderAdapter.senderEmail,
      name: emailProviderAdapter.senderName || 'no-reply',
    },
    subject: 'otp authorization',
    text: `${otpDocument.otp}`,
  });

  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({
    message: '`otp` sent through email'
  }));

  return;
}