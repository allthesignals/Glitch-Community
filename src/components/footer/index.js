import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from '@fogcreek/shared-components';

import Image from 'Components/images/image';
import Link from 'Components/link';
import { useTracker } from 'State/segment-analytics';
import { useGlobals } from 'State/globals';

import styles from './footer.styl';
import { emoji } from '../global.styl';

const FooterLinkIcon = ({ icon }) => <Icon className={emoji} icon={icon} />;

const FooterLink = ({ className, href, trackClick, linkText, icon }) => (
  <div className={classnames(styles.footerLinkWrap, className)}>
    <Link className={styles.footerLink} to={href} onClick={() => trackClick({ href, targetText: linkText })}>
      {linkText}
      <FooterLinkIcon icon={icon} />
    </Link>
  </div>
);

const TeamsFooterLink = ({ trackClick, href }) => {
  const linkText = 'Glitch Teams';
  return (
    <div className={classnames(styles.footerLinkWrap, styles.teams)}>
      <Link className={styles.footerLink} to={href} onClick={() => trackClick({ href, targetText: linkText })}>
        <PlatformsIcon />
        {linkText}
      </Link>
    </div>
  );
};

const PlatformsIcon = () => (
  <Image
    className={styles.platformsIcon}
    src="https://cdn.glitch.com/be1ad2d2-68ab-404a-82f4-6d8e98d28d93%2Ffor-platforms-icon.svg?1506442305188"
    alt=""
  />
);

const Footer = ({ containerClass }) => {
  const { location } = useGlobals();
  const trackClick = useTracker('Marketing CTA Clicked', {
    url: location.pathname,
  });
  return (
    <footer className={classnames(styles.container, containerClass)} role="contentinfo" aria-label="Glitch Footer Links">
      <FooterLink href="/about" trackClick={trackClick} icon="crystalBall" linkText="About Glitch" />
      <FooterLink href="/about/careers" trackClick={trackClick} icon="fishingPole" linkText="We're Hiring" />
      <FooterLink href="/culture" trackClick={trackClick} icon="newspaper" linkText="Blog" />

      <FooterLink href="/help/" trackClick={trackClick} icon="umbrella" linkText="Help Center" />
      <FooterLink href="http://status.glitch.com/" trackClick={trackClick} icon="horizontalTrafficLight" linkText="System Status" />
      <FooterLink href="/legal" trackClick={trackClick} icon="scales" linkText="Legal Stuff" />
      <TeamsFooterLink href="/teams" trackClick={trackClick} />
    </footer>
  );
};
Footer.propTypes = {
  containerClass: PropTypes.string,
};

Footer.defaultProps = {
  containerClass: '',
};

export default Footer;
