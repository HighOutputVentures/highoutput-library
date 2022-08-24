/* eslint-disable import/extensions */
import { Connection, Model, Schema } from 'mongoose';
import * as R from 'ramda';
import { StorageAdapter } from '../interfaces/storage-adapter';
import { Subscription } from '../types';

export default class MongooseStorageAdapter implements StorageAdapter {
  private models = {
    User: Model,
    Subscription: Model,
    Customer: Model,
  };

  constructor(
    private opts: {
      connection: Connection;
      userModel: string;
    },
  ) {
    const subscriptionSchema = new Schema<Subscription>(
      {
        user: {
          type: Buffer,
          required: true,
          index: true,
        },
        tier: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
        },
      },
      { timestamps: true },
    );
    const customerSchema = new Schema(
      {
        user: {
          type: Buffer,
          required: true,
          index: true,
        },
        customerId: {
          type: String,
          required: true,
        },
      },
      { timestamps: true },
    );

    this.models.Subscription = this.opts.connection.model(
      'Subscription',
      subscriptionSchema,
    );
    this.models.Customer = this.opts.connection.model(
      'Customer',
      customerSchema,
    );
    this.models.User = this.opts.connection.model(this.opts.userModel);
  }

  async getSubscription(params: { id: Buffer }) {
    return this.models.Subscription.findOne({
      user: params.id,
    }).lean();
  }

  async updateSubscription(params: { id: Buffer; subscription: string }) {
    return this.models.Subscription.findOneAndUpdate(
      { user: params.id },
      { ...R.pick(['subscription'], params) },
    ).lean();
  }

  async deleteSubscription(params: { id: Buffer }) {
    return this.models.Subscription.findOneAndUpdate(
      { user: params.id },
      { subscription: {} },
    ).lean();
  }

  async findOneCustomerById(params: { id: Buffer }) {
    return this.models.Customer.findOne({ user: params.id });
  }

  async saveUserAsCustomer(params: { id: Buffer; customerId: string }) {
    return this.models.Customer.create({
      user: params.id,
      customerId: params.customerId,
    });
  }
}
