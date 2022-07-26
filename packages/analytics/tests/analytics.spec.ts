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
  const analytics = new Analytics({ project: params.project });

  return { analytics };
}

describe('Analytics', () => {
  describe('#createAccount', () => {
    test('should create an account', async () => {
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
        fieldA: accountDetails.fieldA.toString('hex'),
        fieldB: accountDetails.fieldB,
        fieldC: accountDetails.fieldC.toString(),
      });
    });
  });

  describe('#createEvent', () => {
    test('should create an event', async () => {
      const mockedFunction = jest.fn();

      const project = chance.word();
      const { analytics } = setup({
        project,
        mockedMixpanelInstance: {
          track: mockedFunction,
        },
      });

      const eventDetails = {
        name: chance.word(),
        accountId: chance.string(),
        fieldA: chance.string(),
        fieldB: Buffer.from(chance.string()),
      };

      analytics.createEvent(eventDetails);

      expect(mockedFunction.mock.calls[0][0]).toEqual(
        eventDetails.name.toString(),
      );
      expect(mockedFunction.mock.calls[0][1]).toEqual({
        $distinct_id: eventDetails.accountId.toString(),
        meta: { project },
        fieldA: eventDetails.fieldA,
        fieldB: eventDetails.fieldB.toString('hex'),
      });
    });
  });
});
