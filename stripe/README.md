# Stripe Library

A simple stripe interface module

## Getting Started

This library binds the model to the stripe library, the model interface is defined below

### Installation

Run `npm install highoutput-stripe` to install

### Features

- Card CRUD methods for a given user
- Uses async/await, does not support callbacks

### Quickstart

```javascript
const Stripe = require('highoutput-stripe');

const model = {
  async retrieveUserbyId(userId) { ... },

  async bindStripeToUser({ sourceId, cardId, stripeId, userId }) { ... },

  async retrieveCard(cardId, userId) { ... },
};

const stripe = new Stripe({
  key: 'sk_test_NkaNTcylDUjmP0hoG075J7S5p1mFZ9',
  model: model,
});


stripe.createCard({
  userId: '',
  sourceId: 'tok_visa',
  description: 'Sample VISA Card'
}).then((card) => { console.log(card); });
```

## new Stripe(options)

The stripe constructor accepts the following configuration

- __key__: the stripe key
- __model__: the model object that contains the defined methods used to access data

## Model Specification

### async retrieveUserById()

Retrieve the user by its id

#### Arguments

- __userId__ {string} the user's id

#### Returns

- __obj.stripeId__ {string} its binded stripe's customer id

### async bindStripeToUser()

Map the user by its stripe ids

#### Arguments

- __obj.userId__ {string} the user's id
- __obj.stripeId__ {string} the stripe customer id
- __obj.cardId__ {string}  the stripe card id
- __obj.sourceId__ {string} the stripe source id

#### Returns

- __obj.userId__ {string} the user's id
- __obj.stripeId__ {string} the stripe customer id
- __obj.cardId__ {string}  the stripe card id
- __obj.sourceId__ {string} the stripe source id

### async retrieveCard()

Retrieve the card by userId and cardId

#### Arguments

- __userId__ {string} the user's id
- __cardId__ {string}  the stripe card id

#### Returns

- __obj.userId__ {string} the user's id
- __obj.stripeId__ {string} the stripe customer id
- __obj.cardId__ {string}  the stripe card id
- __obj.sourceId__ {string} the stripe source id
