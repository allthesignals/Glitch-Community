import React from 'react';
import classNames from 'classnames';
import { Helmet } from 'react-helmet-async';
import ReactKonami from 'react-konami';
import { Button } from '@fogcreek/shared-components';
import Link from 'Components/link';
import Logo from 'Components/header/logo';
import Footer from 'Components/footer';
import ErrorBoundary from 'Components/error-boundary';
import MadeOnGlitch from 'Components/footer/made-on-glitch';
import styles from './about.styl';

function HeaderLinks() {
  return (
    <nav className={styles.headerActions}>
      <a href="/about">About</a>
      <a href="/about/company">Company</a>
      <a href="/about/careers">Careers</a>
      <a href="/about/press">Press</a>
      <a href="/about/events">Events</a>
    </nav>
  );
}

const AboutLayout = ({ children, mainClassName }) => (
  <div className={styles.content}>
    <Helmet title="About Glitch">
      <body data-grey="true" />
      <title>About Glitch</title>
      <meta name="description" content="Simple, powerful, free tools to create and use millions of apps." />
    </Helmet>
    <Button as="a" href="#main" className={styles.visibleOnFocus}>
      Skip to Main Content
    </Button>
    <header role="banner" className={styles.header}>
      <Link to="/" className={styles.logoWrap}>
        <Logo />
      </Link>
      <HeaderLinks />
    </header>
    <main id="main" className={classNames(styles.main, mainClassName)}>
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
);

export default AboutLayout;
