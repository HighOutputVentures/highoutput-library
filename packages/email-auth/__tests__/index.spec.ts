import { Chance } from 'chance';
import cryptoRandomString from 'crypto-random-string';

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
  it('should fail to send email', async function (this: Context) {
    const response = await this.request.post('/users/login').send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Error Email Required');
  });

  it('should send email', async function (this: Context) {
    const emailAdress = chance.email();

    const response = await this.request.post('/users/login').send({ email: emailAdress });

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      text: `Email sent to ${emailAdress} \n\n <a href="/users/login/otp"> login </a>`,
      message: 'Email OTP',
    });
  });
});

describe('#get', () => {
  test('initial get', async function (this: Context) {
    const response = await this.request.get('/');

    expect(response.status).toBe(200);
    expect(response.body).toBeEmpty();
  });
});

describe('#authenticate', () => {
  it('should fail to authenticate: email and otp not provided', async function (this: Context) {
    const response = await this.request
      .post('/users/login/otp')
      .send({});

    expect(response.status).toBe(401);
    expect(response.body).not.toHaveProperty('text');
    expect(response.body.message).toBeUndefined();
  });

  it('should fail to authenticate: email and otp not found', async function (this: Context) {
    const emailAdress = chance.email();
    const OTP = cryptoRandomString({ length: 6, type: 'numeric' });

    const response = await this.request
      .post('/users/login/otp')
      .send({ email: emailAdress, otp: OTP });

    expect(response.status).toBe(401);
    expect(response.body).not.toHaveProperty('text');
    expect(response.body.message).toBeUndefined();
  });

  it('should authenticate given email and otp', async function (this: Context) {
    const response = await this.request
      .post('/users/login/otp')
      .send({ email: 'tisbelord@gmail.com', otp: 241929 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('text');
    expect(response.body.message).toBe('Email OTP Verify');
  });
});
