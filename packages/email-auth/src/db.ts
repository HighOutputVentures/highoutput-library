import mongoose from 'mongoose';
import logger from '../logger';

// main
export function main(host: string) {
  return new Promise((resolve) => {
    mongoose
      .connect(host)
      .then((value) => {
        logger.info('successfully connected');
        resolve(value);
      });
  });
}

export function close(): Promise<void> {
  return mongoose.disconnect();
}
