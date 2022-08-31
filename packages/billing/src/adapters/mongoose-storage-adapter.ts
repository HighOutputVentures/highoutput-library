/* eslint-disable import/extensions */
import { Connection, Model, Schema } from 'mongoose';
import { StorageAdapter } from '../interfaces/storage-adapter';

export default class MongooseStorageAdapter implements StorageAdapter {
  private models = {
    User: Model,
    Subscription: Model,
  };

  constructor(
    private opts: {
      connection: Connection;
      userModel: string;
    },
  ) {
    const subscriptionSchema = new Schema(
      {
        user: {
          type: Buffer,
          required: true,
          unique: true,
        },
        customer: {
          type: String,
          unique: true,
        },
        product: { type: String },
        quantity: { type: Number },
      },
      { timestamps: true },
    );

    subscriptionSchema.index({ user: 1, customerId: 1 });

    this.models.Subscription = this.opts.connection.model(
      'Subscription',
      subscriptionSchema,
    );

    this.models.User = this.opts.connection.model(this.opts.userModel);
  }

  async getSubscription(filter: { user?: Buffer; customer?: string }) {
    return this.models.Subscription.findOne({
      $or: [{ user: filter.user }, { customer: filter.customer }],
    }).lean();
  }

  async updateSubscription(
    customer: string,
    update: {
      product?: string;
      quantity?: number;
    },
  ) {
    return this.models.Subscription.findOneAndUpdate({ customer }, update, {
      new: true,
      upsert: true,
    }).lean();
  }

  async deleteSubscription(customer: string) {
    await this.models.Subscription.findOneAndUpdate(
      { customer },
      { product: undefined },
    ).lean();
  }

  async findOneCustomer(filter: { user?: Buffer; customer?: string }) {
    return this.models.Subscription.findOne({
      $or: [{ user: filter.user }, { customer: filter.customer }],
    }).lean();
  }

  async saveCustomer(doc: { user: Buffer; customer: string }) {
    await this.models.Subscription.create(doc);
  }
}
