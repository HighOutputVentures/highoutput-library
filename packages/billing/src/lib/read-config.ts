/* eslint-disable import/extensions */
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd';
import path from 'path';
import { readFile } from 'fs/promises';
import * as R from 'ramda';
import { StripeConfig } from '../types';

export default async function readConfig(config: string) {
  const ajv = new Ajv();
  const configPath = path.join(process.cwd(), config);
  const configSchema: JTDSchemaType<StripeConfig> = {
    properties: {
      tiers: {
        elements: {
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
          optionalProperties: {
            pricePerUnit: { type: 'int32' },
            free: { type: 'boolean' },
          },
        },
      },
      customerPortal: {
        properties: {
          returnUrl: { type: 'string' },
          businessProfile: {
            properties: {
              headline: { type: 'string' },
            },
            optionalProperties: {
              privacyPolicyUrl: { type: 'string' },
              termsOfServiceUrl: { type: 'string' },
            },
          },
        },
      },
    },
  };
  const parse = ajv.compileParser(configSchema);

  const data = await readFile(configPath, { encoding: 'utf8' });
  const parsedConfig = parse(data);

  if (R.isNil(parsedConfig)) {
    throw new Error(parse.message);
  }

  return parsedConfig;
}
