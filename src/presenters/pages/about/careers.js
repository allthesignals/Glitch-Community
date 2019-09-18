import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Mark, Icon } from '@fogcreek/shared-components';
import { Helmet } from 'react-helmet-async';
import AboutLayout from './about-layout';
import styles from './careers.styl';
import '../../../utils/lever/lever.styl';

const blueMark = '#aad6fb';
const pinkMark = '#ffaabf';

const pageDescription = 'Glitch is where you’ll do your best work. Here’s why.';
const pageTitle = 'About Glitch - Careers';

const LeverSection = () => {
  import('../../../utils/lever/lever.js');
  window.leverJobsOptions = { accountName: 'glitch', includeCss: true };
  return <section id="lever-jobs-container" className={styles.backgroundSection} />;
};

const AboutCareersPage = withRouter(() => (
  <AboutLayout>
    <Helmet>
      <meta name="description" content={pageDescription} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content="glitch, career, careers, job, jobs, hire, hiring, work, new york, nyc, remote, us, role, position, listing" />
      <meta property="og:title" content={pageTitle} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta property="og:description" content={pageDescription} />
    </Helmet>
    <h1>Careers</h1>
    <h2>
      <Mark color={pinkMark}>Open positions</Mark>
    </h2>
    <LeverSection />
    <section>
      <h2>
        <Mark color={blueMark}>Things you won’t find at most other companies</Mark>
      </h2>
      <p>Glitch is where you’ll do your best work. Here are just a few examples of why working at Glitch is different.</p>
    </section>
  </AboutLayout>
));

export default AboutCareersPage;
