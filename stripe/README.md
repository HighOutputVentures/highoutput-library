# Stripe Library

## new Stripe(options)

- options.key
- options.userModel
- options.stripeModel
- options.propertyMap

## User Model Interface

### async retrieveById(userId)

### async bindStripeId(userId, stripeId)

## Stripe Model Interface

Required Fields

- obj.stripeId
- obj.sourceId
- obj.cardId
- obj.userId

### async save(obj)

Input Object

- obj.stripeId
- obj.sourceId
- obj.cardId
- obj.userId

### retrieveCard(cardId, userId)

Return Object

- obj.stripeId
- obj.sourceId
- obj.cardId
- obj.userId

### retrieveByCardId(cardId)

Return Object

- obj.stripeId
- obj.sourceId
- obj.cardId
- obj.userId