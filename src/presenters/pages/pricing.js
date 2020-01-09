import React from 'react';
import { Button } from '@fogcreek/shared-components';

import Layout from 'Components/layout';
import GlitchHelmet from 'Components/glitch-helmet';
import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import useSubscriptionStatus from 'State/subscription-status';

import styles from './pricing.styl';

const PricingPage = () => {
  const subscriptionStatus = useSubscriptionStatus();
  return (
    <Layout>
      <GlitchHelmet title="/pricing title TODO" description="/pricing description TODO" canonicalUrl="/pricing" />
      <main id="main" aria-label="Glitch Pricing Page">
        <Heading tagName="h1">Get Glitch Pro</Heading>
        <div className={styles.pricingBlocks}>
          <div className={styles.pricingBlock}>
            <Heading tagName="h2">Free</Heading>
            <Text>$0/month</Text>
            <Text>
              <ul>
                <li>Create and collaborate on code</li>
                <li>Public and private repositories</li>
                <li>Integrate with GitHub</li>
              </ul>
            </Text>

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
            <Text>
              <ul>
                <li>Everything in Glitch Free</li>
                <li>Boosted performance for projects</li>
              </ul>
            </Text>

            {subscriptionStatus.fetched &&
              (subscriptionStatus.isActive ? (
                <Button variant="primary" as="a" href="/settings">
                  Manage Your Subscription
                </Button>
              ) : (
                <Button variant="cta">Sign Up</Button>
              ))}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default PricingPage;
