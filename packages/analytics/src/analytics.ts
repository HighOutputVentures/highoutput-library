import { ObjectId } from '@highoutput/object-id';
import mixpanel, { Mixpanel } from 'mixpanel';
import R from 'ramda';

function serialize(doc: Record<string, unknown>) {
  const obj: Record<string, unknown> = doc;

  return R.reduce(
    (accum, [field, value]) => {
      if (value instanceof Buffer) {
        return {
          ...accum,
          [field]: (value as Buffer).toString('hex'),
        };
      }

      if (value instanceof ObjectId) {
        return {
          ...accum,
          [field]: (value as ObjectId).toString(),
        };
      }

      return {
        ...accum,
        [field]: value,
      };
    },
    {},
    R.toPairs(obj) as [string, unknown][],
  ) as Record<string, unknown>;
}

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
    const extraFields = serialize(
      R.omit(
        ['accountId', 'firstname', 'lastname', 'email', 'created'],
        params,
      ),
    );

    this.driver.people.set(params.accountId.toString(), {
      $distinct_id: params.accountId.toString(),
      meta: { project: this.project },
      $first_name: params.firstname,
      $last_name: params.lastname,
      $email: params.email,
      $created: params.created ?? new Date(),
      ...extraFields,
    });
  }

  createEvent(params: { name: string; accountId: string; [key: string]: any }) {
    this.driver.track(params.name, {
      $distinct_id: params.accountId,
      meta: { project: this.project },
      ...serialize(R.omit(['accountId', 'name'], params)),
    });
  }
}
