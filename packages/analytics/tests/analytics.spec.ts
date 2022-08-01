import EventEmitter from 'events';
import delay from '@highoutput/delay';
import { ObjectId } from '@highoutput/object-id';
import Chance from 'chance';
import mixpanel, { Mixpanel } from 'mixpanel';
import { Analytics } from '../src';

jest.mock('mixpanel');

const chance = new Chance();

function setup(params: { project: string; mockedMixpanelInstance: unknown }) {
  (mixpanel as jest.Mocked<typeof mixpanel>).init.mockImplementation(
    () => params.mockedMixpanelInstance as unknown as Mixpanel,
  );
  const analytics = new Analytics({ project: params.project, token: 'secret' });

  return { analytics };
}

describe('Analytics', () => {
  describe('#createAccount', () => {
    test('should create an account', async () => {
      const mockedFunction = jest.fn(function (_args, _args2, cb) {
        cb();
      });

      const project = chance.word();
      const { analytics } = setup({
        project,
        mockedMixpanelInstance: {
          people: {
            set: mockedFunction,
          },
        },
      });

      const accountDetails = {
        accountId: chance.string(),
        firstname: chance.first(),
        lastname: chance.last(),
        email: chance.email(),
        created: new Date(),
      };

      analytics.createAccount(accountDetails);

      expect(mockedFunction.mock.calls[0][0]).toEqual(
        accountDetails.accountId.toString(),
      );
      expect(mockedFunction.mock.calls[0][1]).toEqual({
        $distinct_id: accountDetails.accountId.toString(),
        meta: { project },
        $first_name: accountDetails.firstname,
        $last_name: accountDetails.lastname,
        $email: accountDetails.email,
        $created: accountDetails.created,
      });
    });

    test('should create an account - missing createDate', async () => {
      const mockedFunction = jest.fn(function (_args, _args2, cb) {
        cb();
      });

      const project = chance.word();
      const { analytics } = setup({
        project,
        mockedMixpanelInstance: {
          people: {
            set: mockedFunction,
          },
        },
      });

      const accountDetails = {
        accountId: chance.string(),
        firstname: chance.first(),
        lastname: chance.last(),
        email: chance.email(),
      };

      analytics.createAccount(accountDetails);

      expect(mockedFunction.mock.calls[0][0]).toEqual(
        accountDetails.accountId.toString(),
      );

      const expectedData = mockedFunction.mock.calls[0][1];
      expect(expectedData.$distinct_id).toEqual(
        accountDetails.accountId.toString(),
      );
      expect(expectedData.meta.project).toEqual(project);
      expect(expectedData.$first_name).toEqual(accountDetails.firstname);
      expect(expectedData.$last_name).toEqual(accountDetails.lastname);
      expect(expectedData.$email).toEqual(accountDetails.email);
      expect(expectedData.$created).toBeDefined();
    });

    test('should create an account - add extra fields', async () => {
      const mockedFunction = jest.fn(function (_args, _args2, cb) {
        cb();
      });
      const project = chance.word();
      const { analytics } = setup({
        project,
        mockedMixpanelInstance: {
          people: {
            set: mockedFunction,
          },
        },
      });

      const accountDetails = {
        accountId: chance.string(),
        firstname: chance.first(),
        lastname: chance.last(),
        email: chance.email(),
        created: new Date(),
        fieldA: Buffer.from('fieldA'),
        fieldB: chance.string(),
        fieldC: ObjectId.from(Buffer.from(chance.string())),
      };

      analytics.createAccount(accountDetails);

      expect(mockedFunction.mock.calls[0][0]).toEqual(
        accountDetails.accountId.toString(),
      );

      expect(mockedFunction.mock.calls[0][1]).toEqual({
        $distinct_id: accountDetails.accountId.toString(),
        meta: { project },
        $first_name: accountDetails.firstname,
        $last_name: accountDetails.lastname,
        $email: accountDetails.email,
        $created: accountDetails.created,
        fieldA: new ObjectId(accountDetails.fieldA).toString(),
        fieldB: accountDetails.fieldB,
        fieldC: accountDetails.fieldC.toString(),
      });
    });

    test('should not throw when request encountered an error', async () => {
      const mockedFunction = jest.fn(function (_args, _args2, cb) {
        cb(new Error('error'));
      });

      const project = chance.word();
      const { analytics } = setup({
        project,
        mockedMixpanelInstance: {
          people: {
            set: mockedFunction,
          },
        },
      });

      const accountDetails = {
        accountId: chance.string(),
      };

      expect(() => analytics.createAccount(accountDetails)).not.toThrow();
    });

    test('should not call mixpanel request if status is SHUTTING_DOWN', async () => {
      const mockedFunction = jest.fn();

      const project = chance.word();
      const { analytics } = setup({
        project,
        mockedMixpanelInstance: {
          people: {
            set: mockedFunction,
          },
        },
      });

      const accountDetails = {
        accountId: chance.string(),
      };

      await analytics.stop();

      analytics.createAccount(accountDetails);

      await delay('1s');

      expect(mockedFunction).not.toBeCalled();
    });
  });

  describe('#createEvent', () => {
    test('should create an event', async () => {
      const mockedFunction = jest.fn(function (_args, _args2, cb) {
        cb();
      });

      const project = chance.word();
      const { analytics } = setup({
        project,
        mockedMixpanelInstance: {
          track: mockedFunction,
        },
      });

      const eventDetails = {
        eventName: chance.word(),
        accountId: chance.string(),
        body: {
          fieldA: chance.string(),
          fieldB: Buffer.from(chance.string()),
        },
      };

      analytics.createEvent(eventDetails);

      expect(mockedFunction.mock.calls[0][0]).toEqual(
        eventDetails.eventName.toString(),
      );
      expect(mockedFunction.mock.calls[0][1]).toEqual({
        $distinct_id: eventDetails.accountId.toString(),
        meta: { project },
        fieldA: eventDetails.body.fieldA,
        fieldB: new ObjectId(eventDetails.body.fieldB).toString(),
      });
    });

    test('should not throw error when request encountered an error', async () => {
      const mockedFunction = jest.fn(function (_args, _args2, cb) {
        cb(new Error('error'));
      });

      const project = chance.word();
      const { analytics } = setup({
        project,
        mockedMixpanelInstance: {
          track: mockedFunction,
        },
      });

      const eventDetails = {
        eventName: chance.word(),
        accountId: chance.string(),
        body: {
          fieldA: chance.string(),
          fieldB: Buffer.from(chance.string()),
        },
      };

      expect(() => analytics.createEvent(eventDetails)).not.toThrow();
    });

    test('should not call mixpanel request if status is SHUTTING_DOWN', async () => {
      const mockedFunction = jest.fn();

      const project = chance.word();
      const { analytics } = setup({
        project,
        mockedMixpanelInstance: {
          track: mockedFunction,
        },
      });

      const eventDetails = {
        eventName: chance.word(),
        accountId: chance.string(),
        body: { fieldA: chance.string(), fieldB: Buffer.from(chance.string()) },
      };

      await analytics.stop();

      analytics.createEvent(eventDetails);

      await delay('1s');

      expect(mockedFunction).not.toBeCalled();
    });
  });

  describe('#stop', () => {
    test('should wait for current item in queue to finish', async () => {
      const callbackWatcher = jest.fn();
      const mockedFunction = jest.fn(function (_args, _args2, cb) {
        const eventEmitter = new EventEmitter();
        const eventName = chance.word();
        eventEmitter.on(eventName, () => {
          callbackWatcher();
          cb();
        });

        (async () => {
          await delay('1s');
          eventEmitter.emit(eventName);
        })();
      });

      const project = chance.word();
      const { analytics } = setup({
        project,
        mockedMixpanelInstance: {
          track: mockedFunction,
        },
      });

      analytics.createEvent({
        eventName: chance.word(),
        accountId: chance.string(),
        body: {
          fieldA: chance.string(),
          fieldB: Buffer.from(chance.string()),
        },
      });

      expect(callbackWatcher).not.toBeCalled();
      await analytics.stop();
      expect(callbackWatcher).toBeCalledTimes(1);
    });

    test('should discard operations waiting in queue', async () => {
      const callbackWatcher = jest.fn();
      const mockedFunction = jest.fn(function (_args, _args2, cb) {
        const eventEmitter = new EventEmitter();
        const eventName = chance.word();
        eventEmitter.on(eventName, () => {
          callbackWatcher();
          cb();
        });

        (async () => {
          await delay('2s');
          eventEmitter.emit(eventName);
        })();
      });

      const project = chance.word();
      const { analytics } = setup({
        project,
        mockedMixpanelInstance: {
          track: mockedFunction,
        },
      });

      analytics.createEvent({
        eventName: chance.word(),
        accountId: chance.string(),
        body: {
          fieldA: chance.string(),
          fieldB: Buffer.from(chance.string()),
        },
      });

      analytics.createEvent({
        eventName: chance.word(),
        accountId: chance.string(),
        body: {
          fieldA: chance.string(),
          fieldB: Buffer.from(chance.string()),
        },
      });

      await analytics.stop();

      expect(callbackWatcher).toBeCalledTimes(1);
      expect(mockedFunction).toBeCalledTimes(1);
    });
  });
});
