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
};

export type ProductsConfig = StripeConfig['tiers'];

export type PortalConfig = StripeConfig['customerPortal'];

export type User = {
  id: Buffer;
};

export type Subscription = {
  user: Buffer;
  tier: string;
  quantity?: number;
};

export type Customer = {
  user: Buffer;
  customerId: string;
};
