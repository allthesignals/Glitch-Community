import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.styl';

const WhitelistedDomainIcon = ({ domain }) => {
  const [error, setError] = useState(null);
  useEffect(() => {
    setError(null);
  }, [domain]);
  if (error) {
    return (
      <div className={styles.whitelistedDomainLabel} aria-label={domain}>
        {domain[0].toUpperCase()}
      </div>
    );
  }

  const src = `https://favicon-fetcher.glitch.me/img/${domain}`;
  return <img className={styles.whitelistedDomainIcon} alt={domain} src={src} onError={setError} />;
};

WhitelistedDomainIcon.propTypes = {
  domain: PropTypes.string.isRequired,
};

export default WhitelistedDomainIcon;
