import React from 'react';
import styled from 'styled-components';
import { Button } from '@fogcreek/shared-components';
import Link from 'Components/link';
import { useFeatureEnabled } from 'State/rollouts';
import useSubscriptionStatus from 'State/subscription-status';
import { CDN_URL } from 'Utils/constants';

const GlitchProBadge = styled.span`
  font-weight: bold;
  font-size: var(--fontSizes-small);
  display: inline-block;
  color: #2800FF;
  padding-top: 2px;
  margin-right: var(--space-1);
`;

const PricingPageButton = styled(Button)`
  position: relative;
  padding: 2px;
  border: none;
  line-height: 1.3;
  background: linear-gradient(12deg, #C454FF, #2800FF, #FA8A7C, #FE7DAB);
  color: #2800FF;
`;

const PricingPageButtonContent = styled.span`
  padding: 0 0.5em 0.1em;
  display: inline-block;
  border-radius: var(--rounded);
  background-color: white;
`;

const ImgBase = styled.img`
  display: inline-block;
  height: 1.5em;
  width: auto;
  color: inherit;
  vertical-align: bottom;
`;


const BoostMarkImg = (props) => <ImgBase src={`${CDN_URL}/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2FBoost%20Mark%20for%20Export.svg`} {...props} />

const GlitchProCTA = () => {
  const userHasPufferfishEnabled = useFeatureEnabled('pufferfish');
  const { fetched, isActive } = useSubscriptionStatus();

  if (!userHasPufferfishEnabled || !fetched) {
    return null;
  }

  if (!isActive) {
    return (
      <PricingPageButton size="small" as={Link} to="/pricing">
        <PricingPageButtonContent>
          Get PRO <BoostMarkImg />
        </PricingPageButtonContent>
      </PricingPageButton>
    );
  }

  return (
    <GlitchProBadge>
      <BoostMarkImg /> PRO
    </GlitchProBadge>
  );
};

export default GlitchProCTA;
