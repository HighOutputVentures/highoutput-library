import mixpanel, { Mixpanel } from 'mixpanel';
import { mixpanelMock } from './mock/mixpanel';

function bufferToHex(value: Buffer) {
  return value.toString('hex');
}

class CentralizedAnalytics {
  protected project: string;
  protected driver: Mixpanel;
  constructor(params: { project: string }) {
    this.project = params.project;
    this.driver =
      process.env.NODE_ENV === 'test'
        ? mixpanelMock
        : mixpanel.init(process.env.MIXPANEL_TOKEN || 'secret');
  }

  createAccount(params: {
    accountId: Buffer;
    firstname?: string;
    lastname?: string;
    email: string;
    organizationId?: Buffer;
    created?: Date;
  }) {
    this.driver.people.set(bufferToHex(params.accountId), {
      $distinct_id: bufferToHex(params.accountId),
      project: this.project,
      $first_name: params.firstname,
      $last_name: params.lastname,
      $email: params.email,
      $created: params.created ?? new Date(),
      organizationId: params.organizationId
        ? bufferToHex(params.organizationId)
        : '',
    });
  }

  updateAccount(params: {
    accountId: Buffer;
    firstname?: string;
    lastname?: string;
    email: string;
  }) {
    this.driver.people.set(bufferToHex(params.accountId), {
      $distinct_id: bufferToHex(params.accountId),
      project: this.project,
      $first_name: params.firstname,
      $last_name: params.lastname,
      $email: params.email,
    });
  }

  createEvent(params: {
    name: string;
    accountId: Buffer;
    body: Record<any, any>;
  }) {
    this.driver.track(params.name, {
      $distinct_id: params.accountId.toString('hex'),
      project: this.project,
      ...params.body,
    });
  }

  trackComponentClickThrough(params: {
    componentName: string;
    accountId: Buffer;
    body: Record<any, any>;
  }) {
    this.driver.track('Component Click-through', {
      $distinct_id: params.accountId.toString('hex'),
      project: this.project,
      componentName: params.componentName,
      ...params.body,
    });
  }
}

export default CentralizedAnalytics;
