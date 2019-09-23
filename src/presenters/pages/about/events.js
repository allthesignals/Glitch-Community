import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CDN_URL } from 'Utils/constants';
import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import Image from 'Components/images/image';
import { Button, Mark } from '@fogcreek/shared-components';
import AboutLayout from './about-layout';
import aboutStyles from './about.styl';

const AboutEventsPage = withRouter(() => {
  useEffect(() => {
    const id = 'typef_orm_share';
    if (!document.getElementById.call(document, id)) {
      const js = document.createElement.call(document, 'script');
      js.id = id;
      js.src = 'https://embed.typeform.com/embed.js';
      const q = document.getElementsByTagName.call(document, 'script')[0];
      q.parentNode.insertBefore(js, q);
    }
  }, []);

  const [currentlyShowingBio, setBio] = useState('anil');

  return (
    <AboutLayout>
      <h1 className={aboutStyles.h1}>Events</h1>
      <center>
        <h2 className={aboutStyles.h2}>
          <Mark color="var(--mark-blue)">Want us to speak at your event?</Mark>
        </h2>
        <Button
          as="a"
          href="https://glitch170098.typeform.com/to/NswdPG"
          data-mode="popup"
          data-hide-headers="true"
          data-hide-footer="true"
          data-submit-close-delay="5"
          target="_blank"
          className="typeform-share"
          style={{ marginTop: '1em' }}
        >
          Tell Us All About It →
        </Button>
        <section className={aboutStyles.bioSection}>
          <h2 className={aboutStyles.h2}>
            <Mark color="var(--mark-purple)">Speaker bios</Mark>
          </h2>
          <p>Find out a little more about our speakers.</p>
          <div className={aboutStyles.bioButtons}>
            <Button onClick={() => setBio('anil')}>Anil Dash</Button>
            <Button onClick={() => setBio('jenn')}>Jenn Schiffer</Button>
            <Button onClick={() => setBio('maurice')}>Maurice Cherry</Button>
          </div>
          {currentlyShowingBio === 'anil' && (
            <div className={aboutStyles.bioEmbed}>
              <iframe
                src="https://glitch.com/embed/#!/embed/anil-bio?path=watch.json&previewSize=100&attributionHidden=true"
                title="anil-bio on Glitch"
                allow="geolocation; microphone; camera; midi; vr; encrypted-media"
              />
            </div>
          )}
          {currentlyShowingBio === 'jenn' && (
            <div className={aboutStyles.bioEmbed}>
              <iframe
                src="https://glitch.com/embed/#!/embed/jenn-bio?path=watch.json&previewSize=100&attributionHidden=true"
                title="jenn-bio on Glitch"
                allow="geolocation; microphone; camera; midi; vr; encrypted-media"
              />
            </div>
          )}
          {currentlyShowingBio === 'maurice' && (
            <div className={aboutStyles.bioEmbed}>
              <iframe
                src="https://glitch.com/embed/#!/embed/maurice-bio?path=watch.json&previewSize=100&attributionHidden=true"
                title="jenn-bio on Glitch"
                allow="geolocation; microphone; camera; midi; vr; encrypted-media"
              />
            </div>
          )}
        </section>
      </center>
    </AboutLayout>
  );
});

export default AboutEventsPage;
