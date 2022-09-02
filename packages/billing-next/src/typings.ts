export type TierConfig = {
  id: string;
  name: string;
  description?: string;
  pricePerUnit?: number; // required unless `free` is set
  free?: boolean;
  metadata?: Record<string, string | number | null>;
};

export type CustomerPortalConfig = {
  returnUrl: string;
  businessProfile: {
    headline: string;
    privacyPolicyUrl?: string;
    termsOfServiceUrl?: string;
  };
};

export type WebhookConfig = {
  url: string;
};

export type Config = {
  tiers: TierConfig[];
  customerPortal: CustomerPortalConfig;
  webhook: WebhookConfig;
};
