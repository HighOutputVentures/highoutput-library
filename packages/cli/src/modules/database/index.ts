import { Command } from 'commander';
import DeleteCommand from './delete';
import ListCommand from './list';
import CreateCommand from './create';
import InspectCommand from './inspect';

const command = new Command('database');

command.addCommand(CreateCommand);
command.addCommand(InspectCommand);
command.addCommand(DeleteCommand);
command.addCommand(ListCommand);


export default command;
