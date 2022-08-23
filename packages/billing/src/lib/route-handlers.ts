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

async function getClientSecret(_req: Request) {
  const setupIntent = await stripe.setupIntents.create({
    payment_method_types: ['card'],
  });

  return R.pick(['id', 'status', 'client_secret', 'customer'], setupIntent);
}

export const handlerMapper = {
  get: {
    tiers: getTiersHandler,
    secret: getClientSecret,
  },
};
