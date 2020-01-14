import React from 'react';
import styled from 'styled-components';
import { Button } from '@fogcreek/shared-components';
import Link from 'Components/link';
import { useFeatureEnabled } from 'State/rollouts';
import useSubscriptionStatus from 'State/subscription-status';

const SettingsPageLink = styled(Link)`
  font-weight: bold;
  display: inline-block;
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

const SVGBase = styled.svg`
  display: inline-block;
  height: 1.5em;
  width: auto;
  color: inherit;
  vertical-align: bottom;
`;

const BoostMark = ({ ...props }) => (
  <SVGBase viewBox="0 0 48 47" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M29.0658 7.43758C30.1482 6.61867 31.711 7.28202 31.8738 8.6295L33.0431 18.3059C33.1032 18.8032 33.3725 19.2513 33.7834 19.5379L41.7781 25.113C42.8915 25.8894 42.7435 27.5807 41.5123 28.1519L32.6708 32.2541C32.2164 32.465 31.8734 32.8595 31.7279 33.3389L28.8961 42.6652C28.5018 43.9639 26.8475 44.3458 25.9238 43.3514L19.2902 36.2103C18.9493 35.8433 18.468 35.639 17.9672 35.6487L8.22225 35.8375C6.86523 35.8638 5.99083 34.4086 6.65113 33.2228L11.3928 24.7071C11.6365 24.2695 11.6821 23.7487 11.5181 23.2753L8.32716 14.0657C7.88281 12.7832 8.99662 11.5019 10.3285 11.7634L19.8926 13.6416C20.3841 13.7381 20.8935 13.6205 21.293 13.3182L29.0658 7.43758Z"
      fill="#FFAABF"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M28.7479 12.0902L23.4159 16.1242C22.2174 17.0309 20.6892 17.3837 19.2146 17.0941L12.6538 15.8058L14.8427 22.1234C15.3347 23.5434 15.198 25.1058 14.4669 26.4188L11.2142 32.2604L17.899 32.1309C19.4016 32.1018 20.8453 32.7146 21.8681 33.8156L26.4186 38.7143L28.3612 32.3166C28.7978 30.8786 29.8267 29.6949 31.19 29.0624L37.255 26.2484L31.7708 22.4239C30.5381 21.5643 29.7303 20.2199 29.55 18.728L28.7479 12.0902ZM31.8738 8.6295C31.711 7.28202 30.1482 6.61867 29.0658 7.43758L21.293 13.3182C20.8935 13.6205 20.3841 13.7381 19.8926 13.6416L10.3285 11.7634C8.99662 11.5019 7.88281 12.7832 8.32716 14.0657L11.5181 23.2753C11.6821 23.7487 11.6365 24.2695 11.3928 24.7071L6.65113 33.2228C5.99083 34.4086 6.86523 35.8638 8.22225 35.8375L17.9672 35.6487C18.468 35.639 18.9493 35.8433 19.2902 36.2103L25.9238 43.3514C26.8475 44.3458 28.5018 43.9639 28.8961 42.6652L31.7279 33.3389C31.8734 32.8595 32.2164 32.465 32.6708 32.2541L41.5123 28.1519C42.7435 27.5807 42.8915 25.8894 41.7781 25.113L33.7834 19.5379C33.3725 19.2513 33.1032 18.8032 33.0431 18.3059L31.8738 8.6295Z"
      fill="url(#paint0_linear)"
    />
    <defs>
      <linearGradient id="paint0_linear" x1="33.8995" y1="14.1957" x2="12.6162" y2="35.8519" gradientUnits="userSpaceOnUse">
        <stop stop-color="#C454FF" />
        <stop offset="0.333333" stop-color="#2800FF" />
        <stop offset="0.651042" stop-color="#FA8A7C" />
        <stop offset="1" stop-color="#FE7DAB" />
      </linearGradient>
    </defs>
  </SVGBase>
);

const GlitchProCTA = () => {
  const userHasPufferfishEnabled = useFeatureEnabled('pufferfish');
  const hasGlitchProEnabled = useSubscriptionStatus();

  if (!userHasPufferfishEnabled) {
    return null;
  }

  if (!hasGlitchProEnabled) {
    return (
      <PricingPageButton size="small" as={Link} to="/pricing">
        <PricingPageButtonContent>
          Get PRO <BoostMark width />
        </PricingPageButtonContent>
      </PricingPageButton>
    );
  }

  return (
    <SettingsPageLink to="/settings">
      <BoostMark /> PRO
    </SettingsPageLink>
  );
};

export default GlitchProCTA;
