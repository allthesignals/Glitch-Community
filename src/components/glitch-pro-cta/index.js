import React from 'react';
import { Button } from '@fogcreek/shared-components';
import Link from 'Components/link';
import useGlitchPro from 'State/glitch-pro';
import { CDN_URL } from 'Utils/constants';
import styles from './styles.styl';

const BoostMark = () => (
  <img alt="" className={styles.boostMark} src={`${CDN_URL}/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2FBoost%20Mark%20for%20Export.svg`} />
);

const GlitchProCTA = () => {
  const { fetched, isActive } = useGlitchPro();

  if (!fetched) {
    return null;
  }

  if (!isActive) {
    return (
      <Button className={styles.pricingPageButton} size="small" as={Link} to="/pricing">
        <span className={styles.pricingPageButtonContent}>
          Get PRO <BoostMark />
        </span>
      </Button>
    );
  }

  return (
    <span className={styles.glitchProBadge}>
      <BoostMark /> PRO
    </span>
  );
};

export default GlitchProCTA;
