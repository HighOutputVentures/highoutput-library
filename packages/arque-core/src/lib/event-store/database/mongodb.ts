/* eslint-disable no-underscore-dangle */
import mongoose, {
  Connection, Document, Model, Schema,
} from 'mongoose';
import AppError from '@highoutput/error';
import R from 'ramda';
import cleanDeep from 'clean-deep';
import {
  EventStoreDatabase, Event, ID,
} from '@arque/types';

function binaryToBufferDeep(body: any): any {
  if (typeof body === 'object') {
    if (body instanceof mongoose.mongo.Binary) {
      return body.buffer;
    }

    return R.map(binaryToBufferDeep)(body);
  }

  return body;
}

function deserialize(document: Event & Document): Event {
  return {
    ...R.pick(['type', 'version', 'timestamp'], document),
    body: binaryToBufferDeep(document.body),
    id: document._id,
    aggregate: R.pick(['id', 'type', 'version'], document.aggregate),
  };
}

export default class implements EventStoreDatabase {
  public readonly connection: Connection;

  public readonly model: Model<Event & Document>;

  constructor(connection?: Connection) {
    this.connection = connection || mongoose.createConnection('mongodb://localhost');

    const schema = new Schema({
      _id: {
        type: Buffer,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      body: {
        type: Schema.Types.Mixed,
        required: true,
      },
      aggregate: {
        type: new Schema({
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
        }, { _id: false, id: false }),
        required: true,
      },
      version: {
        type: Number,
        required: true,
      },
      timestamp: {
        type: Date,
        required: true,
      },
    }, { _id: false });
    schema.index({ 'aggregate.id': 1, 'aggregate.version': -1 }, { unique: true });
    schema.index({ 'aggregate.id': 1 });
    schema.index({ 'aggregate.version': -1 });

    this.model = this.connection.model('Event', schema);
  }

  public async saveEvent(event: Event): Promise<void> {
    try {
      await this.model.create({
        ...event,
        _id: event.id,
      });
    } catch (err) {
      if (err.code === 11000) {
        throw new AppError('AGGREGATE_VERSION_EXISTS', 'Aggregate version already exists.');
      }

      throw err;
    }
  }

  public async retrieveAggregateEvents(params: {
    aggregate: ID;
    first?: number;
    after?: number;
  }): Promise<Event[]> {
    let query: Record<string, any> = {
      'aggregate.id': params.aggregate,
    };

    if (params.after) {
      query = {
        ...query,
        'aggregate.version': {
          $gt: params.after,
        },
      };
    }

    const result = await this.model
      .find(query)
      .sort({ 'aggregate.version': 1 })
      .limit(params.first || 1000);

    return R.map(deserialize, result);
  }

  public async retrieveEvents(params: {
    first?: number;
    after?: ID;
    filters: {
      aggregate?: {
        id?: ID;
        type?: string;
      };
      version?: number;
      type?: string;
    }[];
  }): Promise<Event[]> {
    let query: Record<string, any> = {
      $or: R.map((item) => cleanDeep({
        ...R.pick(['version', 'type'], item),
        'aggregate.id': item.aggregate?.id,
        'aggregate.type': item.aggregate?.type,
      }), params.filters),
    };

    if (params.after) {
      query = {
        $and: [
          {
            _id: {
              $gt: params.after,
            },
          },
          query,
        ],
      };
    }

    const result = await this.model
      .find(query)
      .sort({ _id: 1 })
      .limit(params.first || 1000);

    return R.map(deserialize, result);
  }
}
