import React from 'react';
import PropTypes from 'prop-types';
import { APP_URL } from 'Utils/constants';
import Image from 'Components/images/image';
import styles from './embed.styl';

const telescopeImageUrl = 'https://cdn.glitch.com/7138972f-76e1-43f4-8ede-84c3cdd4b40a%2Ftelescope_404.svg?1543258683849';

// Babel does not transpile URLSearchParams, so using this as a compatibility check for showing embeds now.
// TODO(sheridan) make this more robust in future
const browserSatisfiesRequirements = (() => {
  try {
    const test = new Function('return () => true'); // eslint-disable-line no-new-func
    if (test()() !== true) {
      throw new Error('Arrow functions are not supported, so the editor will not work');
    }
    return true;
  } catch (error) {
    console.log(
      "Sorry, you don't have the necessary JavaScript features to run Glitch code editors. Try applying your latest system updates, or try again with a different web browser.",
      error,
    );
  }
  return false;
})();

const Embed = ({ domain, loading }) => (
  <div className={styles.embedContainer}>
    {browserSatisfiesRequirements ? (
      // Embed iframe for app
      <iframe
        className={styles.embedIframe}
        title={`${domain} on Glitch`}
        allow="geolocation; microphone; camera; midi; encrypted-media"
        height="100%"
        width="100%"
        allowvr="yes"
        loading={loading}
        src={`${APP_URL}/embed/#!/embed/${domain}?path=README.md&previewSize=100`}
      />
    ) : (
      // Error message if JS not supported
      // TODO(sheridan): Refactor this once we have a true error component
      <div>
        <Image src={telescopeImageUrl} width="35%" alt="" />
        <div>
          <h2>The web browser you're using is missing some important Javascript features</h2>
          <p>To use this app, please try applying your latest system updates, or try again with a different web browser.</p>
        </div>
      </div>
    )}
  </div>
);

Embed.propTypes = {
  domain: PropTypes.string.isRequired,
  loading: PropTypes.oneOf(['lazy', 'eager', 'auto']),
};

Embed.defaultProps = {
  loading: 'auto',
};

export default Embed;
