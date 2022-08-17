/* eslint-disable import/extensions */
import Stripe from 'stripe';
import stripe from './setup';
import { PortalConfig } from '../types';

export default async function setupCustomerPortal(
  config: PortalConfig,
  products: Stripe.BillingPortal.ConfigurationCreateParams.Features.SubscriptionUpdate.Product[],
) {
  const configuration = await stripe.billingPortal.configurations.create({
    business_profile: {
      headline: config.businessProfile.headline,
      privacy_policy_url: config.businessProfile.privacyPolicyUrl,
      terms_of_service_url: config.businessProfile.termsOfServiceUrl,
    },
    features: {
      customer_update: {
        allowed_updates: ['email'],
        enabled: true,
      },
      payment_method_update: {
        enabled: true,
      },
      invoice_history: {
        enabled: true,
      },
      subscription_cancel: {
        enabled: true,
        mode: 'at_period_end',
      },
      subscription_update: {
        enabled: true,
        default_allowed_updates: ['price'],
        products,
      },
    },
    default_return_url: config.returnUrl,
  });

  return configuration.id;
}
