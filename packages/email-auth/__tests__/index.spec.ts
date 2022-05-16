import { Chance } from 'chance';

import { Email } from '../src/types';
import { setup, SetupContext, teardown } from './setup';

const chance = new Chance();

type Context = SetupContext;

beforeEach(async function (this: Context) {
  await setup.apply(this);
});

afterEach(async function (this: Context) {
  await teardown.apply(this);
});

describe('#sendEmail', () => {
  it('should send email', async function (this: Context) {
    const email = chance.email() as Email;

    const response = await this.request.post('/users/login').send({ email });

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      text: `Email sent to ${email} \n\n <a href="/users/login/otp"> login </a>`,
      message: 'Email OTP',
    });
  });
});

describe('#authenticate', () => {
  it('should authenticate given email and otp', async function (this: Context) {
    const response = await this.request
      .post('/users/login/otp')
      .send({ email: 'tisbelord@gmail.com', otp: 241929 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('text');
    expect(response.body.message).toBe('Email OTP Verify');
  });
});
