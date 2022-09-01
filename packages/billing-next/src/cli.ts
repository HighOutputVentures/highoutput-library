import 'reflect-metadata';
import { program } from 'commander';
import { command as InitCommand } from './commands/init';

program.name('billing').usage('[options] [command]');

program.addCommand(InitCommand);

program.parse(process.argv);
