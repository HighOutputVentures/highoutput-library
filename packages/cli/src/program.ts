import { program } from 'commander';
import UserModule from './modules/user';
import DeploymentModule from './modules/deployment';
import DatabaseModule from './modules/database';

program
  .name('hovcli')
  .usage('[options] [command]')
  .version(require('../package.json').version);

program.addCommand(UserModule);
program.addCommand(DeploymentModule);
program.addCommand(DatabaseModule);

export default program;
