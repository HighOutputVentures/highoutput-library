import LocalConnection from '../connection/local';
import { Connection } from '../types';

let connection: Connection;

export default function () {
  if (!connection) {
    connection = new LocalConnection();
  }

  return connection;
}
