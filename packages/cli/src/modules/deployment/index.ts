import { Command } from 'commander';
import CreateCommand from './create';
import LogsCommand from './logs';
import UpdateCommand from './update';
import DeleteCommand from './delete';
import ListCommand from './list';
import InspectCommand from './inspect';
import DeployCommand from './deploy';

const command = new Command('deployment');

command.addCommand(CreateCommand);
command.addCommand(UpdateCommand);
command.addCommand(DeployCommand);
command.addCommand(DeleteCommand);
command.addCommand(InspectCommand);
command.addCommand(LogsCommand);
command.addCommand(ListCommand);


export default command;
