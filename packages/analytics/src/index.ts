import mixpanel, { Mixpanel } from 'mixpanel';

export class Analytics {
  protected meta: any;
  protected driver: Mixpanel;

  constructor(params: { project: string }) {
    this.meta = { project: params.project };
    this.driver = mixpanel.init(process.env.MIXPANEL_TOKEN || 'secrets');
  }

  createAccount(params: {
    accountId: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    created?: Date;
  }) {
    this.driver.people.set(params.accountId.toString(), {
      $distinct_id: params.accountId.toString(),
      project: this.meta.project,
      $first_name: params.firstname,
      $last_name: params.lastname,
      $email: params.email,
      $created: params.created ?? new Date(),
    });
  }

  createEvent(params: {
    name: string;
    accountId: string;
    body: Record<any, any>;
  }) {
    this.driver.track(params.name, {
      $distinct_id: params.accountId,
      project: this.meta.project,
      ...params.body,
    });
  }
}
