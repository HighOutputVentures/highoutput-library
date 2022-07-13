import { ObjectId } from '@highoutput/object-id';
import Chance from 'chance';

describe('analytics', () => {
  const chanceHelper = new Chance();
  it('should create an account', async () => {
    const mockAnalytics = {
      createAccount: jest.fn(
        async (params: {
          accountId: ObjectId;
          firstname?: string;
          lastname?: string;
          email: string;
          organizationId?: ObjectId;
          created?: Date;
        }) => {
          console.log(params);
        },
      ),
    };
    mockAnalytics.createAccount({
      accountId: new ObjectId(chanceHelper.integer()),
      firstname: chanceHelper.first(),
      lastname: chanceHelper.last(),
      email: chanceHelper.email(),
      organizationId: new ObjectId(chanceHelper.integer()),
      created: new Date(),
    });
  });
});
