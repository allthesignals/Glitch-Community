import React from 'react';
import { Button, Icon, Loader } from '@fogcreek/shared-components';

import Heading from 'Components/text/heading';
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

const Stamp = ({ labelImage, label }) => (
  <div className={styles.stamp}>
    <Heading tagName="h2" className={styles.stampLabel}>{label}</Heading>
    <Image src={labelImage} alt="" />
  </div>
);

const Postcards = () => {
  return (
    <div className={styles.postcards}>
      <Postcard stamp={<Stamp label="Update" labelImage=""} subheading="My Stuff" outerBorderColor="#EAE6FF" innerBorderColor="#7460E1" buttonText="All New Features">
        Quickly save cool apps to your My Stuff collection with a single click.
      </Postcard>
    </div>
  );
};

const Postcard = ({ title, children, innerBorderColor, outerBorderColor, stamp }) => {
  return (
    <div className={styles.postcard} style={{ '--inner-border-color': innerBorderColor, '--outer-border-color': outerBorderColor }}>
      <div className={styles.postcardContent}>{children}</div>
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
