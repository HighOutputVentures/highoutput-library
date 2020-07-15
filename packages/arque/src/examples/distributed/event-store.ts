import mongoose from 'mongoose';
import { DistributedEventStoreServer } from '../..';
import { MongoDBEventStoreDatabase } from '../../lib/event-store';
import { connection } from './common';

export default {
  async start() {
    await new DistributedEventStoreServer({
      connection,
      database: new MongoDBEventStoreDatabase(mongoose.createConnection('mongodb://localhost/arque')),
    }).start();
  },
};
