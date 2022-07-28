import { Command } from 'commander';
import CreateCommand from './create';
import DeleteCommand from './delete';
import ListCommand from './list';

const command = new Command('user');

command.addCommand(CreateCommand);
command.addCommand(DeleteCommand);
command.addCommand(ListCommand);

export default command;
