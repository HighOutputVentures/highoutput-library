/* eslint-disable no-underscore-dangle */
import { Connection, Document, Model, Schema } from 'mongoose';
import R from 'ramda';
import {
  Customer,
  IStripeProviderStorageAdapter,
  Subscription,
  Tier,
  Value,
  ValueType,
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

  #valueModel: Model<Value>;

  #customerModel: Model<Customer>;

  #subscriptionModel: Model<Subscription>;

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

    this.#valueModel = connection.model(
      'Value',
      new Schema<Value>({
        id: {
          type: String,
          required: true,
          unique: true,
          enum: Object.values(ValueType),
        },
        value: {
          type: String,
          required: true,
        },
      }),
    );

    this.#customerModel = connection.model(
      'Customer',
      new Schema<Customer>({
        id: {
          type: String,
          required: true,
          unique: true,
        },
        stripeCustomer: {
          type: String,
          required: true,
          unique: true,
        },
      }),
    );

    this.#subscriptionModel = connection.model(
      'Subscription',
      new Schema<Subscription>({
        id: {
          type: String,
          required: true,
          unique: true,
        },
        stripeSubscription: {
          type: String,
          required: true,
          unique: true,
        },
        tier: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      }),
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

  async insertValue(value: Value) {
    await this.#valueModel.create(value);
  }

  async findValue(id: ValueType) {
    return this.#valueModel.findOne({ id }).lean();
  }

  async updateValue(id: ValueType, value: string) {
    await this.#valueModel.findOneAndUpdate({ id }, { value });
  }

  async findCustomer(id: string) {
    return this.#customerModel.findOne({ id }).lean();
  }

  async insertCustomer(customer: Customer) {
    await this.#customerModel.create(customer);
  }

  async insertSubscription(subscription: Subscription) {
    await this.#subscriptionModel.create(subscription);
  }

  async findSubscription(id: string) {
    return this.#subscriptionModel.findOne({ id }).lean();
  }
}
