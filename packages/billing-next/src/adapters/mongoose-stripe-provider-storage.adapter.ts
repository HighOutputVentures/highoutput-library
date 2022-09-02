/* eslint-disable no-underscore-dangle */
import { Connection, Document, Model, Schema } from 'mongoose';
import R from 'ramda';
import {
  IStripeProviderStorageAdapter,
  Tier,
} from '../interfaces/stripe.provider';

function serialize(document: Document) {
  return {
    id: document._id,
    ...R.omit(['_id', '__v'], document.toObject()),
  };
}

type TierDocument = Document<Tier>;

export class MongooseStripeProdiverStorageAdapter
  implements IStripeProviderStorageAdapter
{
  #tierModel: Model<TierDocument>;

  constructor(connection: Connection) {
    this.#tierModel = connection.model<TierDocument>(
      'Tier',
      new Schema({
        _id: {
          type: String,
        },
        stripePrices: {
          type: [String],
          required: true,
        },
        stripeProduct: {
          type: String,
          required: true,
        },
      } as never),
    );
  }

  async insertTier(tier: Tier) {
    await this.#tierModel.create({
      _id: tier.id,
      ...R.pick(['stripePrices', 'stripeProduct'], tier),
    });
  }

  async updateTier(id: string, params: Partial<Omit<Tier, 'id'>>) {
    await this.#tierModel.updateOne(
      { _id: id },
      {
        $set: params,
      },
    );
  }

  async findTier(id: string): Promise<Tier | null> {
    const document = await this.#tierModel.findById(id);

    if (!document) {
      return null;
    }

    return serialize(document) as Tier;
  }

  async listTiers() {
    const documents = await this.#tierModel.find({});

    if (!documents) {
      return null;
    }

    return R.map(serialize, documents) as Tier[];
  }
}
