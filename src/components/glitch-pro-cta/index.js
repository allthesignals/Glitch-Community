import React from 'react';
import { Button } from '@fogcreek/shared-components';
import Link from 'Components/link';
import useGlitchPro from 'State/glitch-pro';
import FilteredTag from 'Utils/filteredTag';
import { StarAvatar } from 'Components/images/avatar';
import styles from './styles.styl';

const GlitchProCTA = () => {
  const { fetched, isActive } = useGlitchPro();

  if (!fetched) {
    return null;
  }

  if (!isActive) {
    return (
      <Button className={styles.pricingPageButton} size="small" as={FilteredTag(Link, ['textWrap'])} to="/pricing">
        <span className={styles.pricingPageButtonContent}>
          Get PRO <StarAvatar className={styles.boostMark} />
        </span>
      </Button>
    );
  }

  return (
    <Link className={styles.glitchProBadge} to="/settings/glitch-pro">
      <StarAvatar className={styles.boostMark} /> PRO
    </Link>
  );
};

export default GlitchProCTA;
