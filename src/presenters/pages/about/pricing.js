import React from 'react';
import { Button } from '@fogcreek/shared-components';

import GlitchHelmet from 'Components/glitch-helmet';
import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import { useAPIHandlers } from 'State/api';
import useStripe from 'State/stripe';
import useSubscriptionStatus from 'State/subscription-status';
import { useFeatureEnabled } from 'State/rollouts';

import AboutLayout from './about-layout';
import { NotFoundPage } from '../error';
import styles from './pricing.styl';

const PricingPage = () => {
  const subscriptionStatus = useSubscriptionStatus();
  const { createSubscriptionSession } = useAPIHandlers();
  const stripe = useStripe();
  const userHasPufferfishEnabled = useFeatureEnabled('pufferfish');

  async function subscribe() {
    try {
      const { data } = await createSubscriptionSession({ successUrl: 'https://glitch.com', cancelUrl: 'https://glitch.com/pricing' });
      const { id: sessionId } = data;
      stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      // TODO decide what kind of error handling we need here
      console.log(err);
    }
  }

  if (!userHasPufferfishEnabled) {
    return <NotFoundPage />;
  }

  return (
    <AboutLayout currentPage="pricing">
      <GlitchHelmet title="/pricing title TODO" description="/pricing description TODO" canonicalUrl="/pricing" />
      <main id="main" aria-label="Glitch Pricing Page">
        <article>
          <Heading tagName="h1">Get Glitch Pro</Heading>
          <div className={styles.pricingBlocks}>
            <div className={styles.pricingBlock}>
              <Heading tagName="h2">Free</Heading>
              <Text>$0/month</Text>
              <ul>
                <li>Create and collaborate on code</li>
                <li>Public and private repositories</li>
                <li>Integrate with GitHub</li>
              </ul>

              {subscriptionStatus.fetched && (
                <Text>
                  <strong>
                    <em>{subscriptionStatus.isActive ? 'You are a Glitch Pro' : 'You are on a free plan'}</em>
                  </strong>
                </Text>
              )}
            </div>

            <div className={styles.pricingBlock}>
              <Heading tagName="h2">Glitch Pro</Heading>
              <Text>$14/month</Text>
              <ul>
                <li>Everything in Glitch Free</li>
                <li>Boosted performance for projects</li>
              </ul>

              {subscriptionStatus.fetched &&
                (subscriptionStatus.isActive ? (
                  <Button variant="primary" as="a" href="/settings">
                    Manage Your Subscription
                  </Button>
                ) : (
                  <Button onClick={subscribe} variant="cta">
                    Sign Up
                  </Button>
                ))}
            </div>
          </div>
        </article>
      </main>
    </AboutLayout>
  );
};

export default PricingPage;
