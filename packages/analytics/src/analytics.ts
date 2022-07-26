import mixpanel, { Mixpanel } from 'mixpanel';
import R from 'ramda';

export class Analytics {
  protected project: string;
  protected driver: Mixpanel;

  constructor(params: { project: string }) {
    this.project = params.project;
    this.driver = mixpanel.init(process.env.MIXPANEL_TOKEN || 'secrets');
  }

  createAccount(params: {
    accountId: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    created?: Date;
    [key: string]: any;
  }) {
    this.driver.people.set(params.accountId.toString(), {
      $distinct_id: params.accountId.toString(),
      meta: { project: this.project },
      $first_name: params.firstname,
      $last_name: params.lastname,
      $email: params.email,
      $created: params.created ?? new Date(),
      ...R.omit(
        ['accountId', 'firstname', 'lastname', 'email', 'created'],
        params,
      ),
    });
  }

  createEvent(params: { name: string; accountId: string; [key: string]: any }) {
    this.driver.track(params.name, {
      $distinct_id: params.accountId,
      meta: { project: this.project },
      ...R.omit(['accountId', 'name'], params),
    });
  }
}
