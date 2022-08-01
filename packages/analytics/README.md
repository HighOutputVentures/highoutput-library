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

// Create or update user
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
// Omit `accountId` if event does not need to be associated to user.
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

#### .setAccount(options)
Create or update user details to. Only the `accountId` is required.

##### options.accountId
Unique identifier of the user. In Mixpanel, this will appear as Distinct ID.

##### options.body
Details of the user. The `firstname`, `lastname`, `email`, and `created` are predefined properties but are not required. If `created` is omitted, it defaults to `new Date()`.

Any additional custom properties can be added. Values with types of `Buffer` or `ObjectID` are serialized into string using [bs58](https://www.npmjs.com/package/bs58).

Note: The corresponding request to Mixpanel is added into a queue.

#### .createEvent(options)
Stores an event to Mixpanel.

Note: The corresponding request to Mixpanel is added into a queue.

##### options.eventName
Type: `string`

Name of the event.

##### options.accountId?
Type: `string`

User associated to the event. If omitted, the event created will not be associated to any user.

##### options.body
Type: `object`

Any properties relevant to the event. Values with types of `Buffer` or `ObjectID` are serialized into string using [bs58](https://www.npmjs.com/package/bs58).

#### .stop()
Clears the queue and waits for the pending request to Mixpanel to finish.
