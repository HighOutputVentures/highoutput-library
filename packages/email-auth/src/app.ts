/// import modules
import Koa, { Context } from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { config } from 'dotenv';

import { EmailAuthentication } from '.';
import { Email } from './types';

/// declare const
config();
const {
  SEND_GRID_API, SENDER_EMAIL, SENDER_NAME, EXPIRY_DURATION, JWT_SECRET,
} = process.env;

///
const app = new Koa();
const route = new Router();
export const emailAuthentication = new EmailAuthentication({
  framework: 'koa',
  providerAdapter: {
    apiKey: SEND_GRID_API || 'null',
    from: {
      email: SENDER_EMAIL as Email,
      name: SENDER_NAME || 'no-name',
    },
  },
  otp: {
    expiryDuration: EXPIRY_DURATION || '30000',
    payload: {
      id: Buffer.from('Hello'),
      subject: Buffer.from('Hello'),
    },
    secret: JWT_SECRET || 'SECRET',
  },
});

/// add middleware
app.use(bodyParser());
app.use(emailAuthentication.middleware());

// routes
app.use(route.routes()).use(route.allowedMethods());

// login homepage
route.get('/', async (ctx: Context) => {
  ctx.response.status = 200;
  ctx.body = '<h1> Home Page </h1>';
});

// user login send OTP
route.post('/users/login', async (ctx: Context) => {
  const { email } = ctx.request.body;
  if (!email) {
    ctx.response.status = 400;
    ctx.body = {
      message: 'Error Email Required',
    };
  } else {
    ctx.response.status = 200;
    await ctx.state.emailAuthentication.sendEmail({
      to: email,
      subject: 'OTP',
      body: 'Hello',
    });
    ctx.body = {
      text: `Email sent to ${email} \n\n <a href="/users/login/otp"> login </a>`,
      message: 'Email OTP',
    };
  }
});

// user login verify otp and acquire token
route.post('/users/login/otp', async (ctx: Context) => {
  const { otp } = ctx.request.body;
  if (!otp) {
    ctx.response.status = 400;
    ctx.body = {
      message: 'Error OTP Required',
    };
  } else {
    ctx.response.status = 200;
    await ctx.state.emailAuthentication.authenticate();
    ctx.body = {
      text: `Login Successful: ${ctx.header.authorization} \n\n <a href="/"> back to home </a>`,
      message: 'Email OTP Verify',
    };
  }
});

export default app;
