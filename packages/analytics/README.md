# analytics
Library to use to send product analytics data to Mixpanel.

  - Methods of this library does not cause breaks in your application logic.
  - Requests sent to Mixpanel are added in a queue with a concurrency of `1`.
  - Has a `.stop()` method to ensure pending request is resolved.

## Install
```
npm install @highoutput/analytics
```

## Usage
```
import Analytics from '@highoutput/analytics';

const analytics = new Analytics({
  project: 'studio',
  token: 'secret',
});

// Create or update account
analytics.setAccount({
  accountId: 'unique-id-123',
  body: {
    firstname: 'juan',
    lastname: 'bautista',
    email: 'juan.bautista@mail.com',
    created: new Date(),
  }
});

// Create an event.
// Omit `accountId` if event does not need to be associated to account.
analytics.createEvent({
  eventName: 'Create Post',
  accountId: 'unique-id-123',
  body: {
    postType: 'SOME_POST_TYPE',
    platformUsed: 'web',
  },
});

// Before application exit, ensure pending request is resolved.
await analytics.stop();
```

## Class: Analytics
Returns a new `analtyics` instance.

### options
Type: `object`

| property | type | description |
| --- | --- | --- |
| `project` | `string` | Unique name of your project. |
| `token` | `string` | Mixpanel token. |

Example:
```typescript
const analytics = new Analytics({
  project: 'studio',
  token: 'secret',
});
```

## Methods

### analytics.setAccount(options)
Create account or update account details. The corresponding request to Mixpanel is added into a queue.

| property | type | description |
| --- | --- | --- |
| `accountId` | `string` | Unique identifier of the account. In Mixpanel, this will appear as Distinct ID. |
| `body` | `object` | Account details. The `firstname`, `lastname`, `email`, and `created` are predefined properties but are not required. If `created` is omitted, it defaults to `new Date()`. Any additional custom properties can be added. Values with types of `Buffer` or `ObjectID` are serialized into string using [bs58](https://www.npmjs.com/package/bs58).|

Example:
```typescript
analytics.setAccount({
  accountId: 'unique-id-123',
  body: {
    firstname: 'juan',
    lastname: 'bautista',
    email: 'juan.bautista@mail.com',
    created: new Date(),
    customPropertyA: 'hello',
    customPropertyB: 'hi',
  }
});
```

### analytics.createEvent(options)
Stores an event to Mixpanel. The corresponding request to Mixpanel is added into a queue.

| property | type | description |
| --- | --- | --- |
| `eventName` | `string` | Name of the event. |
| `accountId?` | `string` | Account ID associated to the event. If omitted, the event created will not be associated to any account. |
| `body` | `object` | Properties relevant to the event. Values with types of `Buffer` or `ObjectID` are serialized into string using [bs58](https://www.npmjs.com/package/bs58). |

Example:
```typescript
// Associated to an account
analytics.createEvent({
  eventName: 'Create Post',
  accountId: 'unique-id-123',
  body: {
    postType: 'SOME_POST_TYPE',
    platformUsed: 'web',
  },
});

// Not associated to an account
analytics.createEvent({
  eventName: 'System Fault',
  body: {
    scope: 'deployment',
  },
});
```

### analytics.stop()
Clears the queue and waits for the pending request to Mixpanel to finish.
