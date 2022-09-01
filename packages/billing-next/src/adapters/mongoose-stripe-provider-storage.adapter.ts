import { Connection, Document, Model, Schema } from 'mongoose';
import R from 'ramda';
import {
  IStripeProviderStorageAdapter,
  Tier,
} from '../interfaces/stripe.provider';

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
}
