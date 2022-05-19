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

describe('EmailAuthentication', () => {
  describe('#sendEmail', () => {
    it('should throw an error when `to` is not supplied', async function (this: Context) {
      const response = await this.request.post('/generateOtp').send({
        message: {}
      });
  
      expect(response.body).toStrictEqual({
        message: '`to` should be supplied',
      });
    });
  
    it('should have a status of 200', async function (this: Context) {
      const response = await this.request.post('/generateOtp').send({
        message: {
          to: 'recipient@gmail.com',
        }
      });
  
      expect(response.status).toBe(200);
    });
  
    it('should have the correct body', async function (this: Context) {
      const response = await this.request.post('/generateOtp').send({
        message: {
          to: 'recipient@gmail.com',
        }
      });
  
      expect(response.body).toStrictEqual({
        message: 'email sent',
        data: {},
      });
    });
  });

  describe('#validateOtp', () => {
    it('should throw an error when `email` is empty', async function (this: Context) {
      const response = await this.request
        .post('/validateOtp')
        .send({
          otp: '123456',
        });
  
      expect(response.status).toBe(404);
      expect(response.body).toStrictEqual({
        message: '`email` should be provided',
      });
    });
  
    it('should throw an error when `otp is empty', async function (this: Context) {
      const emailAdress = chance.email();
      const OTP = cryptoRandomString({ length: 6, type: 'numeric' });
  
      const response = await this.request
        .post('/validateOtp')
        .send({ email: emailAdress });
  
      expect(response.status).toBe(404);
      expect(response.body).toStrictEqual({
        message: '`otp` should be provided',
      });
    });
  
    it('should throw an error when no otp found', async function (this: Context) {
      const response = await this.request
        .post('/validateOtp')
        .send({ email: chance.email(), otp: '241929' });
  
      expect(response.status).toBe(404);
      expect(response.body).toStrictEqual({
        message: 'invalid `otp` or `email`'
      });
    });
  });
});



