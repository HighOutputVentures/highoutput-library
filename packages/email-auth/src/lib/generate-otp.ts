import http from 'http';

import { EmailableProviderAdapter, PersistenceAdapter } from '../interfaces';
import { getRequestData } from './get-request-data';

export const generateOtp = async (
  request: http.IncomingMessage,
  response: http.ServerResponse,
  persistenceAdapter: PersistenceAdapter,
  emailProviderAdapter: EmailableProviderAdapter,
  otpExpiryDuration: number,
) => {
  const body = JSON.parse(await getRequestData(request));
            
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

  const message = {
    to: body.message.to,
    from: {
      email: emailProviderAdapter.senderEmail,
      name: emailProviderAdapter.senderName || 'no-reply',
    },
    subject: 'otp authorization',
    text: `${otpDocument.otp}`,
  };
  
  await emailProviderAdapter.sendEmail(message);

  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({
    message: 'email sent',
    data: {},
  }));

  return;
}