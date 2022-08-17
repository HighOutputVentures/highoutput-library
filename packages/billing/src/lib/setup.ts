/* eslint-disable import/extensions */
/* eslint-disable no-console */
import Stripe from 'stripe';
import { PortalConfig } from '../types';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Secret key is required.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-08-01',
});

export default stripe;

export async function setupCustomerPortal(
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

  console.log(`Portal configuration created successfully: ${configuration.id}`);
}
