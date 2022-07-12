import Chance from 'chance';
import CentralizedAnalytics from '../src';

describe('mixpanel', () => {
  const chanceHelper = new Chance();
  it('should save user data', async () => {
    const cpm = new CentralizedAnalytics({ project: chanceHelper.word() });
    cpm.createAccount({
      accountId: Buffer.from(chanceHelper.integer().toString()),
      firstname: chanceHelper.first(),
      lastname: chanceHelper.last(),
      email: chanceHelper.email(),
      organizationId: Buffer.from(chanceHelper.integer().toString()),
      created: new Date(),
    });
  });

  it('should update user data', async () => {
    const cpm = new CentralizedAnalytics({ project: chanceHelper.word() });
    cpm.updateAccount({
      accountId: Buffer.from(chanceHelper.integer().toString()),
      firstname: chanceHelper.first(),
      lastname: chanceHelper.last(),
      email: chanceHelper.email(),
    });
  });

  it('should create event', async () => {
    const cpm = new CentralizedAnalytics({ project: chanceHelper.word() });
    cpm.createEvent({
      name: chanceHelper.word(),
      accountId: Buffer.from(chanceHelper.integer().toString()),
      body: {
        fieldA: chanceHelper.word(),
      },
    });
  });

  it('should track component click-through', async () => {
    const cpm = new CentralizedAnalytics({ project: chanceHelper.word() });
    cpm.trackComponentClickThrough({
      componentName: chanceHelper.word(),
      accountId: Buffer.from(chanceHelper.integer().toString()),
      body: {
        fieldA: chanceHelper.word(),
      },
    });
  });
});
