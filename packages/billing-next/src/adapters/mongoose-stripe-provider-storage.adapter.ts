/* eslint-disable no-underscore-dangle */
import { Connection, Document, Model, Schema } from 'mongoose';
import R from 'ramda';
import {
  User,
  EventLog,
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

  #userModel: Model<User>;

  #subscriptionModel: Model<Subscription>;

  #eventModel: Model<EventLog>;

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
          unique: true,
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

    this.#userModel = connection.model(
      'User',
      new Schema<User>({
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
      new Schema<Subscription>(
        {
          stripeSubscription: {
            type: String,
            required: true,
            unique: true,
          },
          user: {
            type: String,
            required: true,
            index: true,
          },
          tier: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            default: 1,
          },
          stripeStatus: {
            type: String,
            enum: [
              'active',
              'canceled',
              'incomplete',
              'incomplete_expired',
              'past_due',
              'trialing',
              'unpaid',
            ],
          },
        },
        {
          timestamps: true,
        },
      ),
    );

    this.#eventModel = connection.model(
      'Event',
      new Schema<EventLog>(
        {
          stripeEvent: {
            type: String,
            required: true,
            unique: true,
          },
          stripeEventType: {
            type: String,
            required: true,
          },
          stripeIdempotencyKey: {
            type: String,
            unique: true,
            required: true,
          },
        },
        {
          timestamps: true,
          timeseries: {
            timeField: 'createdAt',
            granularity: 'minutes',
          },
          expires: '3d',
        },
      ),
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
    const document = await this.#tierModel.findOne({
      $or: [{ id }, { stripeProduct: id }],
    });

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

  async findUser(id: string) {
    return this.#userModel
      .findOne({
        $or: [{ id }, { stripeUser: id }],
      })
      .lean();
  }

  async insertUser(user: User) {
    await this.#userModel.create(user);
  }

  async insertSubscription(subscription: Omit<Subscription, 'id'>) {
    await this.#subscriptionModel.create(subscription);
  }

  async findSubscriptionByUser(user: string) {
    const doc = await this.#subscriptionModel.findOne({ user });

    if (!doc) {
      return null;
    }

    return serialize(doc) as Subscription;
  }

  async updateSubscription(
    id: string,
    params: Partial<Omit<Subscription, 'id'>>,
  ) {
    await this.#subscriptionModel.updateOne(
      { stripeSubscription: id },
      { $set: params },
    );
  }

  async insertEvent(event: Omit<EventLog, 'id'>) {
    await this.#eventModel.create(event);
  }

  async findEvent(key: string) {
    return this.#eventModel
      .findOne({
        $or: [{ stripeEvent: key }, { stripeIdempotencyKey: key }],
      })
      .lean();
  }
}
