import React from 'react';
import PropTypes from 'prop-types';
import { AnimationContainer, slideDown, Icon } from '@fogcreek/shared-components';

import Heading from 'Components/text/heading';
import ProjectEmbed from 'Components/project/project-embed';
import Note from 'Components/collection/note';
import BookmarkButton from 'Components/buttons/bookmark-button';

import { useCurrentUser } from 'State/current-user';
import { useToggleBookmark } from 'State/collection';
import { useTrackedFunc } from 'State/segment-analytics';

import FeaturedProjectOptionsPop from './featured-project-options-pop';
import styles from './featured-project.styl';
import { emoji } from '../global.styl';

const Top = ({
  featuredProject,
  collection,
  updateNote,
  hideNote,
  isAuthorized,
  unfeatureProject,
  createNote,
  isAnonymousUser,
  bookmarkAction,
  hasBookmarked,
  isPlayer,
}) => (
  <div className={styles.top}>
    <div className={styles.left}>
      {!isPlayer && (
        <Heading tagName="h2">
          Featured Project
          <Icon className={emoji} icon="clapper" inTitle />
        </Heading>
      )}
      {collection && (
        <div className={styles.note}>
          <Note project={featuredProject} collection={collection} updateNote={updateNote} hideNote={hideNote} isAuthorized={isAuthorized} />
        </div>
      )}
    </div>
    <div className={styles.right}>
      {!isAnonymousUser && !window.location.pathname.includes('my-stuff') && (
        <div className={styles.bookmarkButtonContainer}>
          <BookmarkButton action={bookmarkAction} initialIsBookmarked={hasBookmarked} projectName={featuredProject.domain} />
        </div>
      )}
      {isAuthorized && !(isPlayer && !!featuredProject.note) && (
        <div className={styles.unfeatureBtn}>
          <FeaturedProjectOptionsPop
            unfeatureProject={unfeatureProject}
            createNote={createNote}
            hasNote={!!featuredProject.note}
            isPlayer={isPlayer}
          />
        </div>
      )}
    </div>
  </div>
);

const FeaturedProject = ({
  addProjectToCollection,
  collection,
  displayNewNote,
  featuredProject,
  hideNote,
  isAuthorized,
  updateNote,
  unfeatureProject,
  isPlayer,
}) => {
  const { currentUser } = useCurrentUser();
  const [hasBookmarked, toggleBookmark] = useToggleBookmark(featuredProject);

  const isAnonymousUser = !currentUser.login;

  const bookmarkAction = useTrackedFunc(toggleBookmark, 'My Stuff Button Clicked', (inherited) => ({
    ...inherited,
    projectName: featuredProject.domain,
    baseProjectId: featuredProject.baseId || featuredProject.baseProject,
    userId: currentUser.id,
    origin: `${inherited.origin}-featured-project`,
    isAddingToMyStuff: !hasBookmarked,
  }));

  return (
    <div data-cy="featured-project" className={styles.featuredProject}>
      <AnimationContainer animation={slideDown} onAnimationEnd={unfeatureProject}>
        {(animateAndUnfeatureProject) => (
          <ProjectEmbed
            top={
              <Top
                featuredProject={featuredProject}
                collection={collection}
                hideNote={hideNote}
                updateNote={updateNote}
                isAuthorized={isAuthorized}
                unfeatureProject={animateAndUnfeatureProject}
                createNote={collection ? () => displayNewNote(featuredProject) : null}
                isAnonymousUser={isAnonymousUser}
                bookmarkAction={bookmarkAction}
                hasBookmarked={hasBookmarked}
                isPlayer={isPlayer}
              />
            }
            project={featuredProject}
            addProjectToCollection={addProjectToCollection}
            previewOnly={isPlayer}
          />
        )}
      </AnimationContainer>
    </div>
  );
};

FeaturedProject.propTypes = {
  addProjectToCollection: PropTypes.func,
  featuredProject: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  unfeatureProject: PropTypes.func.isRequired,
  collection: PropTypes.object,
  displayNewNote: PropTypes.func,
  hideNote: PropTypes.func,
  updateNote: PropTypes.func,
  isPlayer: PropTypes.bool,
};

FeaturedProject.defaultProps = {
  addProjectToCollection: null,
  collection: null,
  displayNewNote: () => {},
  hideNote: () => {},
  updateNote: () => {},
  isPlayer: false,
};

export default FeaturedProject;
