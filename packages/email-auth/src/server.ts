import { Server } from 'http';
import { config } from 'dotenv';

import app from './app';
import { main, close } from './db';
import logger from '../logger';

config();

const port = 5000;
const host = process.env.MONGO_URI || 'null';
let server: Server;

// DB
export function serverOpen() {
  main(host).then(() => {
    // open server
    server = app.listen(port, () => logger.info(`Server is listening on port ${port}...`));
  });
}

export function serverClose() {
  close().then(() => {
    server.close();
  });
}

serverOpen();
