import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Mark, SegmentedButton } from '@fogcreek/shared-components';
import Heading from 'Components/text/heading';
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
    <AboutLayout currentPage="events">
      <Heading tagName="h1">Events</Heading>
      <Heading tagName="h1">
        <Mark color="var(--mark-blue)">Want us to speak at your event?</Mark>
      </Heading>
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
        <Heading tagName="h1">
          <Mark color="var(--mark-purple)">Speaker bios</Mark>
        </Heading>
        <p>Find out a little more about our speakers.</p>
        <SegmentedButton
          value={currentlyShowingBio}
          onChange={setBio}
          options={[{ id: 'anil', label: 'Anil Dash' }, { id: 'jenn', label: 'Jenn Schiffer' }, { id: 'maurice', label: 'Maurice Cherry' }]}
        />
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
    </AboutLayout>
  );
});

export default AboutEventsPage;
