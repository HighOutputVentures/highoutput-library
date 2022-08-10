# `billing`

> TODO: description

## Usage

```
interface AuthorizationAdapter {
  authorize(ctx) User {}
}

const server = new BillingServer({
  stripeSecretKey: string;
  authorizationAdapter: AuthorizationAdapter;
});
// ....
app.use(server.expressMiddleware());
```

## Tasks
### initialize the Stripe environment
Build a CLI utility that initializes the Stripe environment, accomplishing the following:
- [ ] generate the `Price` objects on Stripe
- [ ] customize the Stripe customer portal

#### configuration file
```
{
  tiers: {
    id: string;
    name: string;
    pricePerUnit?: number; // required unless `free` is set
    free?: boolean;
  }[],
  customerPortal: {
    returnUrl: string;
    businessProfile: {
      headline: string;
      privacyPolicyUrl?: string;
      termsOfServiceUrl?: string;
    }
  }
}
```

#### command
```
STRIPE_SECRET_KEY=<stripe secret key> billing-cli init <config file>
```

### GET /tiers
Retrieve the list of pricing tiers.

### GET /secret
Retrieve the client secret needed to set up a payment method.

### PUT /subscription
Update the user subscription.

### GET /subscription
Retrieve the user subscription.

### GET /portal
Redirect user to the Stripe customer portal.

### webhooks
