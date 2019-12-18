import React from 'react';
import { Button, Icon, Loader } from '@fogcreek/shared-components';
import classnames from 'classnames';
import Heading from 'Components/text/heading';
import ProjectsList from 'Components/containers/projects-list';
import CoverContainer from 'Components/containers/cover-container';
import { UserLink, WrappingLink } from 'Components/link';
import SignInPop from 'Components/sign-in-pop';
import { getUserAvatarStyle, getUserLink } from 'Models/user';
import { useCurrentUser } from 'State/current-user';
import ProjectItem from 'Components/project/project-item';
import { RowContainer, RowItem } from 'Components/containers/row';
import Ideas from './ideas';

import styles from './recent-projects.styl';
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
  const numProjects = currentUser.projects.length;
  const isAnonymousUser = !currentUser.login;
  const projectsToShow = currentUser.projects.slice(0, 3);

  const ideasCount = 3 - numProjects;
  const twoIdeas = ideasCount === 2;
  const recentProjectsExtraWrapperClass = twoIdeas ? styles.twoIdeasRecentProjectsWrapper : styles.oneIdeaRecentProjectsWrapper;
  const ideasExtraWrapperClass = twoIdeas ? styles.twoIdeasIdeasWrapper : styles.oneIdeaIdeasWrapper;
  return (
    <section data-cy="recent-projects">
      <Heading tagName="h2">
        <UserLink user={currentUser}>
          Your Projects <Icon className={styles.arrow} icon="arrowRight" />
        </UserLink>
      </Heading>
      {isAnonymousUser && <SignInNotice />}
      <CoverContainer type="dashboard" item={currentUser}>
        <div className={styles.coverWrap}>
          <div className={styles.avatarWrap}>
            <WrappingLink user={currentUser} href={getUserLink(currentUser)}>
              <div className={styles.userAvatar} style={getUserAvatarStyle(currentUser)} />
            </WrappingLink>
          </div>
          <div className={styles.projectsWrap}>
            <div className={classnames(styles.projectItemWrap, recentProjectsExtraWrapperClass)}>
              {fetched ? (
                projectsToShow.map((project) => <ProjectItem key={project.id} className={styles.projectItem} project={project} showEditButton />)
              ) : (
                <Loader style={{ width: '25px' }} />
              )}
            </div>
            {numProjects < 3 && <Ideas wrapperClass={classnames(styles.ideasWrapper, ideasExtraWrapperClass)} count={ideasCount} />}
          </div>
        </div>
        {isAnonymousUser && <ClearSession clearUser={clear} />}
      </CoverContainer>
    </section>
  );
};

export default RecentProjects;
