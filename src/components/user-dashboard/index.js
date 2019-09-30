import React from 'react';
import { Button, Icon, Loader } from '@fogcreek/shared-components';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import Image from 'Components/images/image';
import ProjectsList from 'Components/containers/projects-list';
import CoverContainer from 'Components/containers/cover-container';
import { UserLink, WrappingLink } from 'Components/link';
import SignInPop from 'Components/sign-in-pop';
import { getUserAvatarStyle, getUserLink } from 'Models/user';
import { useCurrentUser } from 'State/current-user';

import styles from './styles.styl';
import { emoji } from '../global.styl';

const SignInNotice = () => (
  <div className={styles.anonUserSignUp}>
    <span>
      <SignInPop /> to keep your projects.
    </span>
  </div>
);

const ClearSession = ({ clearUser }) => {
  function clickClearSession() {
    if (
      // eslint-disable-next-line
      !window.confirm(`All activity from this anonymous account will be cleared.  Are you sure you want to continue?`)
    ) {
      return;
    }
    clearUser();
  }

  return (
    <div className={styles.clearSession}>
      <Button onClick={clickClearSession} size="small" variant="warning">
        Clear Session <Icon className={emoji} icon="balloon" />
      </Button>
    </div>
  );
};

const RecentProjects = () => {
  const { currentUser, fetched, clear } = useCurrentUser();
  const isAnonymousUser = !currentUser.login;

  return (
    <section data-cy="recent-projects">
      <Heading tagName="h2">
        <UserLink user={currentUser}>
          Your Projects <Icon className={styles.arrow} icon="arrowRight" />
        </UserLink>
      </Heading>
      {isAnonymousUser && <SignInNotice />}
      <CoverContainer type="user" item={currentUser}>
        <div className={styles.coverWrap}>
          <div className={styles.avatarWrap}>
            <WrappingLink user={currentUser} href={getUserLink(currentUser)}>
              <div className={styles.userAvatar} style={getUserAvatarStyle(currentUser)} />
            </WrappingLink>
          </div>
          <div className={styles.projectsWrap}>
            {fetched ? <ProjectsList layout="row" projects={currentUser.projects.slice(0, 3)} /> : <Loader style={{ width: '25px' }} />}
          </div>
        </div>
        {isAnonymousUser && <ClearSession clearUser={clear} />}
      </CoverContainer>
    </section>
  );
};

const Stamp = ({ labelImage, label, icon }) => (
  <div className={styles.stamp}>
    <Heading tagName="h2" className={styles.stampLabel}>
      {label}
    </Heading>
    <Image src={labelImage} alt="" />
    <span className={styles.stampIcon}>
      <Icon icon={icon} />
    </span>
  </div>
);

const Postcards = () => {
  return (
    <div className={styles.postcards}>
      <Postcard
        heading="Update"
        subheading="My Stuff"
        stampImage="https://cdn.glitch.com/179ed565-619c-4f66-b3a3-35011d202379%2Fpostcard-label-update.svg"
        outerBorderColor="#7460E1"
        innerBorderColor="#EAE6FF"
        buttonText="All New Features"
        buttonProps={{ onClick: () => {} }}
      >
        Quickly save cool apps to your My Stuff collection with a single click.
      </Postcard>

      <Postcard
        heading="Video"
        subheading="Potch Learns Twilio!"
        stampImage="https://cdn.glitch.com/179ed565-619c-4f66-b3a3-35011d202379%2Fpostcard-label-video.svg"
        outerBorderColor="#E1D262"
        innerBorderColor="#FEED64"
        buttonText="Watch It"
        buttonProps={{ onClick: () => {} }}
      >
        Follow along as we build a collaborative rainbow app you can interacti with via SMS.
      </Postcard>
    </div>
  );
};

const Postcard = ({ heading, subheading, stampImage, stampIcon, innerBorderColor, outerBorderColor, thumbnail, buttonText, buttonProps, children }) => {
  return (
    <div className={styles.postcard} style={{ '--inner-border-color': innerBorderColor, '--outer-border-color': outerBorderColor }}>
      <div className={styles.postcardContent}>
        <Stamp label={heading} labelImage={stampImage} icon={stampIcon} />
        <div className={styles.postcardContentContainer}>
          <Heading className={styles.postcardSubheading} tagName="h3">{subheading}</Heading>
          <Text className={styles.postcardText} size="14px" defaultMargin>
            {children}
          </Text>
          <Button variant="secondary" size="small" {...buttonProps}>{buttonText}</Button>
        </div>
        {thumbnail && (
          <div className={styles.postcardThumbnailContainer}>
            <Image src={thumbnail} alt="" />
          </div>
        )}
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const { currentUser } = useCurrentUser();

  return (
    <>
      <RecentProjects />
      {currentUser.projects.length > 2 && <Postcards />}
    </>
  );
};

export default UserDashboard;
