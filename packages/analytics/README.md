# analytics

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

analytics.createAccount({
  accountId: 'unique-id-123',
  firstname: 'juan',
  lastname: 'bautista',
  email: 'juan.bautista@mail.com',
  created: new Date(),
});

analytics.createEvent({
  eventName: 'CREATE_POST',
  accountId: 'unique-id-123',
  body: {
    postType: 'SOME_POST_TYPE',
    platformUsed: 'web',
  },
});
```

## API
### Analytics(options)
Returns a new `analtyics` instance.

#### options
Type: `object`

##### project
Type: `string`
Unique name of your project.

##### token
Type: `string`
Token from Mixpanel.

### queue
`Analytics` instance.

#### .createAccount(options)
Stores account details to Mixpanel. Only the `accountId` is required. The `firstname`, `lastname`, `email`, and `created` are predefined properties but are not required. If `created` is omitted, it defaults to `new Date()`.

Any additional custom properties can be added. Values with types of `Buffer` or `ObjectID` are serialized into string using [bs58](https://www.npmjs.com/package/bs58).

Note: The corresponding request to Mixpanel is added into a queue.

#### .createEvent(options)
Stores an event to Mixpanel.

Note: The corresponding request to Mixpanel is added into a queue.

##### options.eventName
Type: `string`

Name of the event.

##### options.accountId
Type: `string`

Account associated to the event. Every event in Mixpanel is associated to a specific account.

##### options.body
Type: `object`

Any properties relevant to the event. Values with types of `Buffer` or `ObjectID` are serialized into string using [bs58](https://www.npmjs.com/package/bs58).

#### .stop()
Clears the queue and waits for the pending request to Mixpanel to finish.
