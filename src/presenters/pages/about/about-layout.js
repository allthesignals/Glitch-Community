import React from 'react';
import classNames from 'classnames';
import { Helmet } from 'react-helmet-async';
import ReactKonami from 'react-konami';
import { Button } from '@fogcreek/shared-components';
import { useFeatureEnabled } from 'State/rollouts';
import GlitchHelmet from 'Components/glitch-helmet';
import Link from 'Components/link';
import Logo from 'Components/header/logo';
import Footer from 'Components/footer';
import ErrorBoundary from 'Components/error-boundary';
import MadeOnGlitch from 'Components/footer/made-on-glitch';
import styles from './about.styl';

function HeaderLinks({ currentPage }) {
  const userHasPufferfishEnabled = useFeatureEnabled('pufferfish');

  return (
    <nav className={styles.headerActions}>
      <Link to="/about" className={currentPage === 'about' ? styles.currentPage : undefined}>
        About
      </Link>
      {userHasPufferfishEnabled && (
        <Link to="/pricing" className={currentPage === 'pricing' ? styles.currentPage : undefined}>
          Pricing
        </Link>
      )}
      <Link to="/about/company" className={currentPage === 'company' ? styles.currentPage : undefined}>
        Company
      </Link>
      <Link to="/about/careers" className={currentPage === 'careers' ? styles.currentPage : undefined}>
        Careers
      </Link>
      <Link to="/about/press" className={currentPage === 'press' ? styles.currentPage : undefined}>
        Press
      </Link>
      <Link to="/about/events" className={currentPage === 'events' ? styles.currentPage : undefined}>
        Events
      </Link>
    </nav>
  );
}

const AboutLayout = ({ children, mainClassName, currentPage }) => (
  <div style={{ maxWidth: '100vw', overflow: 'hidden', background: '#f5f5f5' }}>
    <div className={styles.content}>
      <Helmet>
        <body data-grey="true" />
      </Helmet>
      <GlitchHelmet
        title="About Glitch"
        description="Glitch is a collaborative programming environment that lives in your browser and deploys code as you type."
      />
      <Button as="a" href="#main" className={styles.visibleOnFocus}>
        Skip to Main Content
      </Button>
      <header role="banner" className={styles.header}>
        <Link to="/" className={styles.logoWrap}>
          <Logo />
        </Link>
        <HeaderLinks currentPage={currentPage} />
      </header>
      <main id="main" className={classNames(styles.main, mainClassName)} aria-label="About Glitch">
        {children}
      </main>
      <aside className={styles.madeOnGlitch}>
        <MadeOnGlitch />
      </aside>
      <Footer containerClass={styles.footerContainerClass} />
      <ErrorBoundary fallback={null}>
        <ReactKonami easterEgg={() => history.push('/secret')} />
      </ErrorBoundary>
    </div>
  </div>
);

export default AboutLayout;
