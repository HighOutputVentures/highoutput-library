import mongoose from 'mongoose';
import { DistributedEventStoreServer, MongoDBEventStoreDatabase } from '@arque/core';
import { connection } from './common';

export default {
  async start() {
    await new DistributedEventStoreServer({
      connection,
      database: new MongoDBEventStoreDatabase(mongoose.createConnection('mongodb://localhost/arque')),
    }).start();
  },
};
