import React from 'react';
import { Button } from '@fogcreek/shared-components';

import GlitchHelmet from 'Components/glitch-helmet';
import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import { useCurrentUser } from 'State/current-user';
import useGlitchPro from 'State/glitch-pro';
import { useFeatureEnabled } from 'State/rollouts';

import AboutLayout from './about-layout';
import { NotFoundPage } from '../error';
import styles from './pricing.styl';

const PricingPage = () => {
  const subscription = useGlitchPro();
  const { fetched: currentUserFetched } = useCurrentUser();
  const userHasPufferfishEnabled = useFeatureEnabled('pufferfish');

  if (!currentUserFetched) {
    return null;
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

              {subscription.fetched && (
                <Text>
                  <strong>
                    <em>{subscription.isActive ? 'You are a Glitch Pro' : 'You are on a free plan'}</em>
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

              {subscription.fetched &&
                (subscription.isActive ? (
                  <Button variant="primary" as="a" href="/settings">
                    Manage Your Subscription
                  </Button>
                ) : (
                  <Button onClick={subscription.subscribe} variant="cta">
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
