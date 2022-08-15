/* eslint-disable import/extensions */
/* eslint-disable no-console */
import { program } from 'commander';
import 'dotenv/config';
import InitializeModule from './modules/init';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../package.json');

program.name('billing-cli').usage('[options] [command]').version(version);

program.addCommand(InitializeModule);

export default program;
