/* eslint-disable import/extensions */
import * as R from 'ramda';
import stripe from './setup';

export default async function setupWebhookEndpoint(url: string) {
  if (R.isNil(url)) {
    throw new Error('URL for webhook endpoint cannot be undefined.');
  }

  const webhookEndpoint = await stripe.webhookEndpoints.create({
    url,
    enabled_events: [
      'customer.subscription.created',
      'customer.subscription.deleted',
      'customer.subscription.updated',
    ],
  });

  return webhookEndpoint.secret;
}
