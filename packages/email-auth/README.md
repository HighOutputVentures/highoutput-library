# `email-auth`

> TODO: description

## Usage

```ts
import EmailAuthentication from '@highoutput-library/email-auth';

const PERSISTENCE_CONFIG = {
  db: mongoose.connection,
  userCollectionString: 'users',
};

const persistenceAdapter = new MongooseAdapter(PERSISTENCE_CONFIG);

const EMAIL_PROVIDER_CONFIG = {
  apiKey: process.env.SENDGRID_API_KEY as string,
  from: {
    email: process.env.SENDER_EMAIL as string || 'emailauth@hov.co',
    name: process.env.SENDER_NAME as string || 'no-reply',
  }
};

const emailProviderAdapter = new SendGridAdapter(EMAIL_PROVIDER_CONFIG);

const server = http.createServer();

const emailAuthentication = new EmailAuthentication({
  server,

  persistenceAdapter,

  emailProviderAdapter,

  jwtSecretKey: 'SECRET',
});

emailAuthentication.use();
```

`generateOtp`
```json
// POST localhost:8080/generateOtp

{
    "message": {
        "to": "ralphcasipe1@gmail.com"
    }
}
```

`validateOtp`
```json
// POST localhost:8080/validateOtp

{
    "email": "ralphcasipe1@gmail.com",
    "otp": "257057"
}
```