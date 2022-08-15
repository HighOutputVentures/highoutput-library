export type StripeConfig = {
  tiers: {
    id: string;
    name: string;
    pricePerUnit?: number; // required unless `free` is set
    free?: boolean;
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

export type PortalConfig = StripeConfig['customerPortal'];
