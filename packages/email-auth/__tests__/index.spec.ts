import { Chance } from 'chance';

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
  });

  describe('#validateOtp', () => {
    it('should throw an error when `email` is empty', async function (this: Context) {
      const response = await this.request
        .post('/validateOtp')
        .send({
          otp: '123456',
        });
  
      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        message: '`email` should be provided',
      });
    });
  
    it('should throw an error when `otp is empty', async function (this: Context) {
      const emailAdress = chance.email();
  
      const response = await this.request
        .post('/validateOtp')
        .send({ email: emailAdress });
  
      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        message: '`otp` should be provided',
      });
    });
  });
});



