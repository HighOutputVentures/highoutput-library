/* eslint-disable no-underscore-dangle */
import mongoose, {
  Connection, Document, Model, Schema,
} from 'mongoose';
import R from 'ramda';
import { SnapshotStore, Snapshot, ID } from '@arque/types';
import { serialize, deserialize } from '@highoutput/serialize';
import generateSnapshotId from '../util/generate-snapshot-id';

export default class implements SnapshotStore {
  public readonly connection: Connection;

  public readonly model: Model<Snapshot & Document>;

  constructor(connection?: Connection) {
    this.connection = connection || mongoose.createConnection('mongodb://localhost');

    const schema = new Schema({
      _id: {
        type: Buffer,
        required: true,
      },
      aggregate: {
        id: {
          type: Buffer,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        version: {
          type: Number,
          required: true,
        },
      },
      state: {
        type: Schema.Types.Mixed,
        required: true,
      },
      timestamp: {
        type: Date,
        required: true,
      },
    }, { _id: false });
    schema.index({ 'aggregate.id': 1, 'aggregate.version': -1 }, { unique: true });

    this.model = this.connection.model<Snapshot & Document>('Snapshot', schema);
  }

  public createSnapshot(params: {
    aggregate: {
      id: ID;
      type: string;
      version: number;
    };
    state: any;
  }) {
    const id = generateSnapshotId(params.aggregate);

    const snapshot = {
      ...params,
      id,
      timestamp: new Date(),
    };

    return {
      ...snapshot,
      save: async () => {
        await this.model.remove({
          'aggregate.id': params.aggregate.id,
          'aggregate.version': params.aggregate.version,
        });

        await this.model.create({
          ...snapshot,
          _id: snapshot.id,
          state: serialize(snapshot.state),
        });

        return snapshot;
      },
    };
  }

  public async retrieveLatestSnapshot(aggregate: {
    id: ID;
    version: number;
  }): Promise<Snapshot | null> {
    const [snapshot] = await this.model.find({
      'aggregate.id': aggregate.id,
      'aggregate.version': {
        $lte: aggregate.version,
      },
    })
      .sort({ 'aggregate.version': -1 })
      .limit(1);

    if (!snapshot) {
      return null;
    }

    return {
      timestamp: snapshot.timestamp,
      id: snapshot._id,
      aggregate: R.pick(['id', 'type', 'version'], snapshot.aggregate),
      state: deserialize(snapshot.state),
    };
  }
}
