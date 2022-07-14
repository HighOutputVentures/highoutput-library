import { ObjectId } from '@highoutput/object-id';
import mixpanel, { Mixpanel } from 'mixpanel';

export class Analytics {
  protected project: string;
  protected driver: Mixpanel;

  constructor(params: { project: string }) {
    this.project = params.project;
    this.driver = mixpanel.init(process.env.MIXPANEL_TOKEN || 'secrets');
  }

  createAccount(params: {
    accountId: ObjectId;
    firstname?: string;
    lastname?: string;
    email: string;
    organizationId?: ObjectId;
    created?: Date;
  }) {
    this.driver.people.set(params.accountId.toString(), {
      $distinct_id: params.accountId.toString(),
      project: this.project,
      $first_name: params.firstname,
      $last_name: params.lastname,
      $email: params.email,
      $created: params.created ?? new Date(),
      organizationId: params.organizationId
        ? params.organizationId.toString()
        : '',
    });
  }
}
