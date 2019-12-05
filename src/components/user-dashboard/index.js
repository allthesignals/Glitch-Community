import React from 'react';
import { Button, Icon } from '@fogcreek/shared-components';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import Image from 'Components/images/image';
import NewStuffContainer from 'Components/new-stuff';
import { useCurrentUser } from 'State/current-user';
import RecentProjects from './recent-projects';

import styles from './styles.styl';

const Stamp = ({ labelImage, label, icon }) => (
  <div className={styles.stamp}>
    <Heading tagName="h2" className={styles.stampLabel}>
      {label}
    </Heading>
    <Image src={labelImage} width="auto" alt="" />
    <span className={styles.stampIcon}>
      <Icon icon={icon} />
    </span>
  </div>
);

const Postcards = ({ marketingContent }) => (
  <div className={styles.postcards}>
    <NewStuffContainer>
      {(showNewStuffOverlay) => (
        <Postcard
          heading="Update"
          subheading="My Stuff"
          stampImage="https://cdn.glitch.com/179ed565-619c-4f66-b3a3-35011d202379%2Fpostcard-label-update.svg"
          stampIcon="dogFace"
          outerBorderColor="#7460E1"
          innerBorderColor="#EAE6FF"
          buttonText="All Updates"
          buttonProps={{ onClick: showNewStuffOverlay }}
          thumbnail="https://cdn.glitch.com/ee609ed3-ee18-495d-825a-06fc588a4d4c%2Fplaceholder.svg"
        >
          Quickly save cool apps to your My Stuff collection with a single click.
        </Postcard>
      )}
    </NewStuffContainer>

    <Postcard
      heading="Video"
      subheading={marketingContent.title}
      stampImage="https://cdn.glitch.com/179ed565-619c-4f66-b3a3-35011d202379%2Fpostcard-label-video.svg"
      stampIcon="television"
      outerBorderColor="#E1D262"
      innerBorderColor="#FEED64"
      buttonText="Watch It"
      buttonProps={{ as: 'a', href: marketingContent.href }}
      waveStyles={{ filter: 'hueRotate(130deg) saturate(.65)' }}
      thumbnail={marketingContent.thumbnail}
    >
      Follow along as we build a collaborative rainbow app you can interact with via SMS.
    </Postcard>

    <Postcard
      heading="Remix This"
      subheading="Remix This"
      stampImage="https://cdn.glitch.com/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2Fideas-label.svg?v=1573670255817"
      stampIcon="lightbulb"
      outerBorderColor="#75d1f8"
      innerBorderColor="#cdeffc"
      buttonText="View App"
      buttonProps={{ as: 'a', href: 'https://glitch.com/~starter-chartjs' }}
      thumbnail="https://cdn.glitch.com/ee609ed3-ee18-495d-825a-06fc588a4d4c%2Fplaceholder.svg"
    >
      Create interactive charts and graphs in the browser using Chart.js.
    </Postcard>
  </div>
);

const Postcard = ({
  heading,
  subheading,
  stampImage,
  stampIcon,
  innerBorderColor,
  outerBorderColor,
  thumbnail,
  buttonText,
  buttonProps,
  waveStyles,
  children,
}) => {
  const content = (
    <>
      {subheading && (
        <Heading className={styles.postcardSubheading} tagName="h3">
          {subheading}
        </Heading>
      )}
      <Text className={styles.postcardText} size="15px" defaultMargin>
        {children}
      </Text>

      <span className={styles.postcardCta}>
        <Button variant="secondary" size="small" {...buttonProps}>
          {buttonText} <Icon icon="arrowRight" />
        </Button>
      </span>
    </>
  );

  return (
    <div className={styles.postcard} style={{ '--inner-border-color': innerBorderColor, '--outer-border-color': outerBorderColor }}>
      <div className={styles.waves} style={waveStyles} aria-hidden="true" />
      <div className={styles.postcardContent}>
        <Stamp label={heading} labelImage={stampImage} icon={stampIcon} />

        {thumbnail ? (
          <div className={styles.postcardColumns}>
            <div className={styles.postcardContentColumn}>{content}</div>
            <div className={styles.postcardThumbnailColumn}>
              <Image src={thumbnail} alt="" />
            </div>
          </div>
        ) : (
          <div className={styles.postcardContentColumn}>{content}</div>
        )}
      </div>
    </div>
  );
};

const UserDashboard = ({ postcardContent }) => {
  const { currentUser } = useCurrentUser();

  return (
    <>
      <RecentProjects />
      {currentUser.projects.length > 2 && <Postcards marketingContent={postcardContent} />}
    </>
  );
};

export default UserDashboard;
