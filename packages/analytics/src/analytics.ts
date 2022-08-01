import Logger from '@highoutput/logger';
import { ObjectId } from '@highoutput/object-id';
import mixpanel, { Mixpanel } from 'mixpanel';
import PQueue from 'p-queue';
import R from 'ramda';

const logger = new Logger(['analytics']);

function serialize(doc: Record<string, unknown>) {
  const obj: Record<string, unknown> = doc;

  return R.reduce(
    (accum, [field, value]) => {
      if (value instanceof Buffer) {
        return {
          ...accum,
          [field]: new ObjectId(value).toString(),
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
  protected queue: PQueue;
  protected status: 'STARTED' | 'SHUTTING_DOWN';

  constructor(params: { project: string; token: string }) {
    this.project = params.project;
    this.driver = mixpanel.init(params.token);
    this.queue = new PQueue({ concurrency: 1 });
    this.status = 'STARTED';
  }

  setAccount(params: {
    accountId: string;
    body: {
      firstname?: string;
      lastname?: string;
      email?: string;
      created?: Date;
      [key: string]: any;
    };
  }) {
    if (this.status === 'SHUTTING_DOWN') return;

    this.queue.add(async () => {
      try {
        await new Promise<void>((resolve, reject) => {
          this.driver.people.set(
            params.accountId.toString(),
            {
              $distinct_id: params.accountId.toString(),
              meta: { project: this.project },
              $first_name: params.body.firstname,
              $last_name: params.body.lastname,
              $email: params.body.email,
              $created: params.body.created ?? new Date(),
              ...serialize(
                R.omit(
                  ['accountId', 'firstname', 'lastname', 'email', 'created'],
                  params.body,
                ),
              ),
            },
            (err) => {
              if (err) {
                reject(err);
              }

              resolve();
            },
          );
        });
      } catch (error) {
        logger.tag('createAccount').verbose(error);
      }
    });
  }

  createEvent(params: {
    eventName: string;
    accountId?: string;
    body: Record<any, any>;
  }) {
    if (this.status === 'SHUTTING_DOWN') return;

    this.queue.add(async () => {
      try {
        await new Promise<void>((resolve, reject) => {
          this.driver.track(
            params.eventName,
            {
              distinct_id: params.accountId,
              meta: { project: this.project },
              ...serialize(params.body),
            },
            (err) => {
              if (err) {
                reject(err);
              }

              resolve();
            },
          );
        });
      } catch (error) {
        logger.tag('createEvent').verbose(error);
      }
    });
  }

  async stop() {
    this.status = 'SHUTTING_DOWN';
    this.queue.clear();
    await this.queue.onIdle();
  }
}
