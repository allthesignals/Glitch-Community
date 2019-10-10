import React, { useState } from 'react';
import { Button, Icon, Loader } from '@fogcreek/shared-components';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import Image from 'Components/images/image';
import BookmarkButton from 'Components/buttons/bookmark-button';
import ProjectsList from 'Components/containers/projects-list';
import CoverContainer from 'Components/containers/cover-container';
import NewStuffContainer from 'Components/new-stuff';
import { UserLink, WrappingLink } from 'Components/link';
import SignInPop from 'Components/sign-in-pop';
import { getUserAvatarStyle, getUserLink } from 'Models/user';
import { getProjectLink } from 'Models/project';
import { useCurrentUser } from 'State/current-user';
import { useCollectionProjects, useToggleBookmark } from 'State/collection';
import { useTrackedFunc } from 'State/segment-analytics';

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
  const numProjects = currentUser.projects.length;
  const isAnonymousUser = !currentUser.login;

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
            {fetched ? (
              <ProjectsList layout="row" projects={currentUser.projects.slice(0, 2)} showEditButton />
            ) : (
              <Loader style={{ width: '25px' }} />
            )}
          </div>
        </div>
        {numProjects < 3 && <Ideas count={3 - numProjects} />}
        {isAnonymousUser && <ClearSession clearUser={clear} />}
      </CoverContainer>
    </section>
  );
};

const Idea = ({ project }) => {
  const { currentUser } = useCurrentUser();
  const [hasBookmarked, toggleBookmark] = useToggleBookmark(project);

  const bookmarkAction = useTrackedFunc(toggleBookmark, `Project ${hasBookmarked ? 'removed from my stuff' : 'added to my stuff'}`, (inherited) => ({
    ...inherited,
    projectName: project.domain,
    baseProjectId: project.baseId || project.baseProject,
    userId: currentUser.id,
    origin: `${inherited.origin}-user-dashboard`,
  }));

  return (
    <div className={styles.idea}>
      <span className={styles.ideaMyStuffBtn}>
        <BookmarkButton action={bookmarkAction} initialIsBookmarked={hasBookmarked} projectName={project.domain} />
      </span>

      <div className={styles.ideaContentContainer}>
        <Button as="a" href={getProjectLink(project.domain)}>
          {project.domain}
        </Button>
        <Text size="14px">{project.description}</Text>
      </div>
      <div className={styles.ideaThumbnailContainer}>
        <Image src={`https://cdn.glitch.com/${project.id}/thumbnail.png?version=${Date.now()}`} alt="" />
      </div>
    </div>
  );
};

const Ideas = ({ count }) => {
  const { value: ideas } = useCollectionProjects({ id: 13045 });
  const [ideasIdx, setIdeasIdx] = useState(0);

  const onClickMoreIdeas = () => {
    const nextIdx = ideasIdx + count;
    if (nextIdx < ideas.length - 1) {
      setIdeasIdx(count + nextIdx);
    }
  };

  return (
    <div className={styles.ideas}>
      <div className={styles.ideasHeader}>
        <Heading className={styles.ideasHeading} tagName="h3">
          <Image alt="Ideas" src="https://cdn.glitch.com/179ed565-619c-4f66-b3a3-35011d202379%2Fideas.svg" />
        </Heading>

        {count > 1 && <Text size="14px">Looking for project ideas? Try remixing a starter.</Text>}

        {ideas && (
          <span className={styles.moreIdeasBtn}>
            <Button variant="secondary" size="small" onClick={onClickMoreIdeas}>
              More Ideas <Icon icon="new" />
            </Button>
          </span>
        )}
      </div>

      {ideas && (
        <div className={styles.ideasGrid}>
          {ideas.slice(ideasIdx, ideasIdx + count).map((project) => (
            <Idea project={project} />
          ))}
        </div>
      )}
    </div>
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
      heading="Notifications"
      stampImage="https://cdn.glitch.com/179ed565-619c-4f66-b3a3-35011d202379%2Fpostcard-label-notifications.svg"
      stampIcon="telephone"
      outerBorderColor="#FFA6BC"
      innerBorderColor="#FFE7EC"
      buttonText="View All"
      buttonProps={{ onClick: () => {} }}
      waveStyles={{ filter: 'hue-rotate(90deg) saturate(.95)' }}
    >
      <em>Coming soon</em>
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
