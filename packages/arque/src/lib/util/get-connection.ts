import AmqpConnection from '../connection/amqp';
import { Connection } from '../types';

let connection: Connection;

export default function () {
  if (!connection) {
    connection = new AmqpConnection();
  }

  return connection;
}
