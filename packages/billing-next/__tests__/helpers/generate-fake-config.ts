import path from 'path';
import fs from 'fs';
import { Config } from '../../src/typings';

export function generateFakeConfig(): Config {
  return JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../assets/config.json'), 'utf8'),
  );
}
