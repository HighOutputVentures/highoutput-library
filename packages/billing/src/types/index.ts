export type StripeConfig = {
  tiers: {
    id: string;
    name: string;
    description?: string;
    pricePerUnit?: number; // required unless `free` is set
    free?: boolean;
    metadata?: Record<string, unknown>;
  }[];
  customerPortal: {
    returnUrl: string;
    businessProfile: {
      headline: string;
      privacyPolicyUrl?: string;
      termsOfServiceUrl?: string;
    };
  };
  webhook: {
    url: string;
  };
};

export type ProductsConfig = StripeConfig['tiers'];

export type PortalConfig = StripeConfig['customerPortal'];

export type User = {
  id: Buffer;
};

export type Subscription = {
  user: Buffer;
  customer: string;
  product: string;
  quantity: number;
};

export type Customer = Pick<Subscription, 'user' | 'customer'>;

export type Methods = 'get' | 'put' | 'post';
export type Routes = 'tiers' | 'secret' | 'subscription' | 'portal' | 'webhook';

export type RouteHandlerMapper<R, S> = {
  [method in Methods]: {
    [endpoint in Routes]+?: (req: R, storageAdapter: S) => Promise<unknown>;
  };
};
