const assert = require('assert');
const stripe = require('stripe');
const R = require('ramda');

function isMongooseModel(model) {
  return typeof model.findOne === 'function' &&
    typeof model.findById === 'function' &&
    typeof model.findByIdAndUpdate === 'function';
}

class Stripe {
  constuctor(options) {
    assert(options.key, '\'key\' is required');
    assert(options.userModel, '\'userModel\' is required');

    this.stripe = stripe(options.key);
    this.userModel = options.userModel;
    this.propertyMap = {
      _id: '_id',
      email: 'email',
      stripeId: 'stripeId',
      ...(options.propertyMap || {}),
    };
  }

  async checkAccount(params) {
    assert(params.email, '\'email\' is required');

    let account;

    if (isMongooseModel(this.userModel)) {
      account = await this.userModel
        .findOne({ [this.propertyMap.email]: params.email });
    } else {
      account = await this.userModel.findByEmail(params.email);
    }

    if (!account) {
      throw new Error('user not found');
    }

    return account;
  }

  async bindUser(params) {
    assert(params.email, '\'email\' is required');
    assert(params.invoice_prefix, '\'invoice_prefix\' is required');

    const {
      balance = 0,
      description = '',
      email,
      invoice_prefix, /* eslint-disable-line */
    } = params;

    await this.checkAccount(params);

    const customer = this.stripe.customers.create({
      account_balance: balance,
      description,
      email,
      invoice_prefix,
    });

    if (isMongooseModel(this.userModel)) {
      await this.userModel.updateOne(
        { [this.propertyMap.email]: params.email },
        { $set: { [this.propertyMap.stripeId]: customer.id } },
      );
    } else {
      await this.userModel.updateUser({
        [this.propertyMap.email]: params.email,
        [this.propertyMap.stripeId]: customer.id,
      });
    }

    return customer;
  }

  async addPaymentMethod(params) {
    assert(params.email, '\'email\' is required');
    assert(params.type, '\'type\' is required');

    /*
      owner object consists of the following fields
      [ address, email, name, phone ]
    */
    assert(params.owner, '\'owner\' is required');
    assert(params.owner.email, '\'owner.email\' is required');

    /* additional payment types will be added after we successfully use card payments */
    if (!R.contains(params.type, ['card'])) {
      throw new Error('payment type not supported');
    }

    const account = await this.checkAccount(params);

    /* create source before appending it to the customers */
    const source = this.stripe.sources.create({
      type: params.type,
      owner: params.owner,
    });

    /* append source to customer */
    this.stripe.customers.createSource(
      account.stripeId,
      { source: source.id },
    );

    return source;
  }

  chargeCard(params) {
    assert(params.amount, '\'amount\' is required');
    assert(params.currency, '\'currency\' is required');
    assert(params.source, '\'source\' is required');

    return this.stripe.charges.create({
      amount: params.amount,
      currency: params.currency,
      source: params.currency,
      description: params.description || '',
    });
  }
}

module.exports = Stripe;
