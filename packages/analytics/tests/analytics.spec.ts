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
        project,
        $first_name: accountDetails.firstname,
        $last_name: accountDetails.lastname,
        $email: accountDetails.email,
        $created: accountDetails.created,
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
        body: {
          fieldA: chance.string(),
          fieldB: chance.string(),
        },
      };

      analytics.createEvent(eventDetails);
      console.log(mockedFunction.mock.calls[0]);
      expect(mockedFunction.mock.calls[0][0]).toEqual(
        eventDetails.name.toString(),
      );
      expect(mockedFunction.mock.calls[0][1]).toEqual({
        $distinct_id: eventDetails.accountId.toString(),
        project,
        ...eventDetails.body,
      });
    });
  });
});
