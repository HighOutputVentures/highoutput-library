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
  describe('#setAccount', () => {
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
        body: {
          firstname: chance.first(),
          lastname: chance.last(),
          email: chance.email(),
          created: new Date(),
        },
      };

      analytics.setAccount(accountDetails);

      expect(mockedFunction.mock.calls[0][0]).toEqual(
        accountDetails.accountId.toString(),
      );
      expect(mockedFunction.mock.calls[0][1]).toEqual({
        $distinct_id: accountDetails.accountId.toString(),
        meta: { project },
        $first_name: accountDetails.body.firstname,
        $last_name: accountDetails.body.lastname,
        $email: accountDetails.body.email,
        $created: accountDetails.body.created,
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
        body: {
          firstname: chance.first(),
          lastname: chance.last(),
          email: chance.email(),
        },
      };

      analytics.setAccount(accountDetails);

      expect(mockedFunction.mock.calls[0][0]).toEqual(
        accountDetails.accountId.toString(),
      );

      const expectedData = mockedFunction.mock.calls[0][1];
      expect(expectedData.$distinct_id).toEqual(
        accountDetails.accountId.toString(),
      );
      expect(expectedData.meta.project).toEqual(project);
      expect(expectedData.$first_name).toEqual(accountDetails.body.firstname);
      expect(expectedData.$last_name).toEqual(accountDetails.body.lastname);
      expect(expectedData.$email).toEqual(accountDetails.body.email);
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
        body: {
          firstname: chance.first(),
          lastname: chance.last(),
          email: chance.email(),
          created: new Date(),
          fieldA: Buffer.from('fieldA'),
          fieldB: chance.string(),
          fieldC: ObjectId.from(Buffer.from(chance.string())),
        },
      };

      analytics.setAccount(accountDetails);

      expect(mockedFunction.mock.calls[0][0]).toEqual(
        accountDetails.accountId.toString(),
      );

      expect(mockedFunction.mock.calls[0][1]).toEqual({
        $distinct_id: accountDetails.accountId.toString(),
        meta: { project },
        $first_name: accountDetails.body.firstname,
        $last_name: accountDetails.body.lastname,
        $email: accountDetails.body.email,
        $created: accountDetails.body.created,
        fieldA: new ObjectId(accountDetails.body.fieldA).toString(),
        fieldB: accountDetails.body.fieldB,
        fieldC: accountDetails.body.fieldC.toString(),
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
        body: {
          fieldA: Buffer.from('fieldA'),
        },
      };

      expect(() => analytics.setAccount(accountDetails)).not.toThrow();
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
        body: {
          fieldA: Buffer.from('fieldA'),
        },
      };

      await analytics.stop();

      analytics.setAccount(accountDetails);

      await delay('1s');

      expect(mockedFunction).not.toBeCalled();
    });
  });

  describe('#createEvent', () => {
    test('should create an event with an accountId', async () => {
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
        distinct_id: eventDetails.accountId.toString(),
        meta: { project },
        fieldA: eventDetails.body.fieldA,
        fieldB: new ObjectId(eventDetails.body.fieldB).toString(),
      });
    });

    test('should create an event without accountId', async () => {
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
