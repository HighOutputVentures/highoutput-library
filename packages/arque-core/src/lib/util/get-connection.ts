import { Connection } from '@arque/types';
import LocalConnection from '../connection/local';

let connection: Connection;

export default function () {
  if (!connection) {
    connection = new LocalConnection();
  }

  return connection;
}
