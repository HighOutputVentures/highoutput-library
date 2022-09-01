import Ajv, { JTDSchemaType } from 'ajv/dist/jtd';
import { readFileSync } from 'fs';
import { injectable } from 'inversify';
import { IConfigProvider } from '../interfaces/config.provider';
import { Config } from '../typings';

const schema: JTDSchemaType<Config> = {
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
          description: { type: 'string' },
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

@injectable()
export class ConfigProvider implements IConfigProvider {
  #config: Config;

  constructor(path: string) {
    const ajv = new Ajv();

    const parser = ajv.compileParser(schema);

    const config = parser(readFileSync(path, { encoding: 'utf8' }));

    if (!config) {
      throw new Error(parser.message);
    }

    this.#config = config;
  }

  get config() {
    return this.#config;
  }
}
