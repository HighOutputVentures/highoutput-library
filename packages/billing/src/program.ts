/* eslint-disable import/extensions */
/* eslint-disable no-console */
import { program } from 'commander';
import InitializeModule from './modules/init';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../package.json');

program.name('billing-cli').usage('[options] [command]').version(version);

program.addCommand(InitializeModule);

program.command('test').action(() => console.log('this a test', version));

export default program;
