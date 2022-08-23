/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
// import { Response } from 'express';
import * as R from 'ramda';
import { Request } from 'express';
import stripe from './setup';
import readConfig from './read-config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function tryCatch(
  fn: (req: Request) => Promise<unknown>,
  param: Request,
): Promise<[null, Awaited<Promise<unknown>>] | [Error]> {
  try {
    const data = await fn(param);
    return [null, data];
  } catch (error) {
    return [error as Error];
  }
}

async function getTiersHandler(req: Request) {
  const { configPath } = req.params;
  const config = await readConfig(configPath);

  return config.tiers;
}

async function getClientSecret(req: Request) {
  const { userId } = req.params;

  const intentList = await stripe.setupIntents.list({
    customer: userId,
  });

  if (!R.isEmpty(intentList.data)) {
    const [intent] = intentList.data;
    return R.pick(['client_secret'], intent);
  }

  const intent = await stripe.setupIntents.create({
    payment_method_types: ['card'],
  });

  return R.pick(['client_secret'], intent);
}

export const handlerMapper = {
  get: {
    tiers: getTiersHandler,
    secret: getClientSecret,
  },
};
