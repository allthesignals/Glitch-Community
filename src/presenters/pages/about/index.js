import React from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { CDN_URL } from 'Utils/constants';
import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import Image from 'Components/images/image';
import { Button, Mark } from '@fogcreek/shared-components';
import AboutLayout from './about-layout';
import styles from './about.styl';

const Unmarked = ({ children }) => <span className={styles.unmarked}>{children}</span>;

function Banner() {
  const illustration = `${CDN_URL}/fe23e93b-e541-4151-ba94-e5119d610be9%2Fabout.svg?v=15693387`;
  const shape = `${CDN_URL}/d2b595e6-45a6-4ddc-8110-038cdb509b16%2Fabout-glitch-shape.svg?v=1560521674329`;
  return (
    <section className={classNames(styles.section, styles.banner)}>
      <div className={styles.bannerShape} style={{ backgroundImage: `url(${shape})` }}>
        <div className={styles.bannerText}>
          <Heading className={styles.bannerTagline} tagName="h1" ariaLabel="What's Glitch?">
            <Unmarked>What's</Unmarked>
            <br />
            <Mark color="var(--mark-blue)">Glitch?</Mark>
          </Heading>
          <Text>Presto, the web is creative again.</Text>
          <Text>Glitch is three things:</Text>
        </div>
      </div>

      <div className={styles.bannerIllustration}>
        <Image src={illustration} alt="" />
      </div>
    </section>
  );
}

function SectionHeading({ markColor, listNumber, headingText, descriptionText }) {
  return (
    <>
      <Heading className={styles.h2} tagName="h2">
        <Mark color={markColor}>
          <small>{`${listNumber}.`}</small>&nbsp;{headingText}
        </Mark>
      </Heading>
      <p className={styles.descriptionText}>{descriptionText}</p>
    </>
  );
}

function FirstSection() {
  return (
    <section className={styles.numberedSection}>
      <SectionHeading
        markColor="var(--mark-blue)"
        listNumber="1"
        headingText="A simple tool for creating web apps"
        descriptionText="We’re evolving “developer tools” into a creative and expressive platform that everyone can use to create the web."
      />
      <div className={styles.sideBySide}>
        <div className={classNames(styles.half, styles.left)}>
          <video autoPlay muted loop playsInline>
            <source type="video/webm" src={`${CDN_URL}/d5cdac21-5e23-4601-8243-d5645f80aa71%2Fcollab.webm?1538421865695`} />
            <source type="video/mp4" src={`${CDN_URL}/d5cdac21-5e23-4601-8243-d5645f80aa71%2Fcollab.mp4?1538421865892`} />
          </video>
          <Heading tagName="h3" className={styles.videoHeading}>
            <Mark color="var(--mark-blue)">Create and collaborate on code</Mark>
          </Heading>
          <p>
            Coding on Glitch is like working together in Google Docs–multiple people can work on the same project at the same time. There’s no setup,
            and you can see changes live on the web as you type.
          </p>
        </div>
        <div className={styles.half}>
          <video autoPlay muted loop playsInline>
            <source type="video/webm" src={`${CDN_URL}/627ec7d8-4273-46c8-9543-7d3cd9fb7005%2Fteams.webm?v=1569518523388`} />
            <source type="video/mp4" src={`${CDN_URL}/627ec7d8-4273-46c8-9543-7d3cd9fb7005%2Fteams.mp4?v=1569518423941`} />
          </video>
          <Heading tagName="h3" className={styles.videoHeading}>
            <Mark color="var(--mark-blue)">For people and teams of all skill levels</Mark>
          </Heading>
          <p>
            For people and teams of all skill levels Glitch makes it easy and fun to express yourself with code, whether you’re a professional
            developer or just starting out. You can create on your own or as part of a team.
          </p>
        </div>
      </div>
      <Button className={styles.centeredButton} as="a" href="https://glitch.com/create">
        Explore What You Can Do with Glitch <span aria-hidden="true">→</span>{' '}
      </Button>
    </section>
  );
}

function SecondSection() {
  return (
    <section className={styles.numberedSection}>
      <SectionHeading
        markColor="var(--mark-pink)"
        listNumber="2"
        headingText="A friendly, creative community"
        descriptionText="Imagine if an app store was filled with millions of apps created by regular people, not just professional developers."
      />
      <div className={styles.sideBySide}>
        <div className={classNames(styles.half, styles.left)}>
          <div className={styles.imageGrid}>
            <img src={`${CDN_URL}/d2b595e6-45a6-4ddc-8110-038cdb509b16%2Froute-shuffle.png`} alt="Route Shuffle app on Glitch" />
            <img src={`${CDN_URL}/d2b595e6-45a6-4ddc-8110-038cdb509b16%2Femoji-garden.png`} alt="Emoji Garden app on Glitch" />
            <img src={`${CDN_URL}/d2b595e6-45a6-4ddc-8110-038cdb509b16%2Fcolor-wander2.png`} alt="Color Wander app on Glitch" />
            <img src={`${CDN_URL}/d2b595e6-45a6-4ddc-8110-038cdb509b16%2FblueRidgeApp.png`} alt="Blue Ridge app on Glitch" />
          </div>
          <Heading tagName="h3" className={styles.videoHeading}>
            <Mark color="var(--mark-pink)">Millions of apps you’ll only find on Glitch</Mark>
          </Heading>
          <p>From useful tools at work, to cutting-edge VR experiences, smart bots, and apps for important causes.</p>
          <Button as="a" href="https://latest-gtw.glitch.me/now">
            Discover the best stuff on the web <span aria-hidden="true">→</span>
          </Button>
        </div>
        <div className={styles.half}>
          <div className={styles.imageGrid}>
            <img src={`${CDN_URL}/d2b595e6-45a6-4ddc-8110-038cdb509b16%2FcreatorMonica.png`} alt="Monica Dinculescu, a creator on Glitch" />
            <img src={`${CDN_URL}/d2b595e6-45a6-4ddc-8110-038cdb509b16%2FcreatorPatrickWeaver.png`} alt="Patrick Weaver, a creator on Glitch" />
            <img
              src={`${CDN_URL}/d2b595e6-45a6-4ddc-8110-038cdb509b16%2FcreatorYeli.png?v=1560245720966`}
              alt="Omayeli Arenyeka, a creator on Glitch"
            />
            <img src={`${CDN_URL}/d2b595e6-45a6-4ddc-8110-038cdb509b16%2FcreatorAdaRoseCannon.png`} alt="Ada Rose Cannon, a creator on Glitch" />
          </div>
          <Heading tagName="h3" className={styles.videoHeading}>
            <Mark color="var(--mark-pink)">The most inclusive & supportive community</Mark>
          </Heading>
          <p>We are creative coders, designers, developers, artists, activists, students, and educators. People just like you.</p>
          <Button as="a" href="https://glitch.com/culture/tag/creator/">
            Learn about amazing creators on Glitch <span aria-hidden="true">→</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ThirdSection() {
  return (
    <section className={styles.numberedSection}>
      <SectionHeading
        markColor="var(--mark-yellow)"
        listNumber="3"
        headingText="A different kind of company"
        descriptionText="We’re here to push the tech world to do better. We aim to set the standard for thoughtful and ethical practices in tech."
      />
      <div className={styles.imageRow}>
        <img src={`${CDN_URL}/d2b595e6-45a6-4ddc-8110-038cdb509b16%2F1727f742f11aad77bc90a650cc0e8f1d-large.jpg`} alt="Glitch staff talking" />
        <img
          src={`${CDN_URL}/b205c719-a61d-400a-9e80-8784c201e1d2%2F91f31d4a0ca5cbd21d7296c723122afb-xlarge.jpg?1559307581223`}
          alt="bag with 'You Got This' and a skateboarding turtle printed on it"
        />
        <img src={`${CDN_URL}/d2b595e6-45a6-4ddc-8110-038cdb509b16%2Fa64374d243f81b26f3d3742d4959cb84-large.jpg`} alt="Glitch staff smiling" />
      </div>
      <Button className={styles.thirdSectionButton} as="a" href="https://glitch.com/about/company">
        Find Out What Makes Glitch Different <span aria-hidden="true">→</span>
      </Button>
    </section>
  );
}

const AboutPage = withRouter(() => (
  <AboutLayout currentPage="about">
    <Banner />
    <FirstSection />
    <SecondSection />
    <ThirdSection />
  </AboutLayout>
));

export default AboutPage;
