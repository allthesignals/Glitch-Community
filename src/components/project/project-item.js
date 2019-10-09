import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { AnimationContainer, slideDown, slideUp, Button, Icon } from '@fogcreek/shared-components';

import Markdown from 'Components/text/markdown';
import BookmarkButton from 'Components/buttons/bookmark-button';
import Image from 'Components/images/image';
import ProfileList from 'Components/profile-list';
import { ProjectLink } from 'Components/link';
import VisibilityContainer from 'Components/visibility-container';
import Note from 'Components/collection/note';
import { FALLBACK_AVATAR_URL, getProjectAvatarUrl, getEditorUrl } from 'Models/project';
import { useProjectMembers } from 'State/project';
import { useProjectOptions } from 'State/project-options';
import { useCurrentUser } from 'State/current-user';
import useDevToggle from 'State/dev-toggles';
import { useGlobals } from 'State/globals';
import { useTrackedFunc } from 'State/segment-analytics';

import ProjectOptionsPop from './project-options-pop';
import styles from './project-item.styl';

const ProfileAvatar = ({ project }) => <Image className={styles.avatar} src={getProjectAvatarUrl(project)} defaultSrc={FALLBACK_AVATAR_URL} alt="" />;

const getLinkBodyStyles = (project, showEditButton) =>
  classnames(styles.linkBody, {
    [styles.private]: project.private,
    [styles.hasFooter]: showEditButton,
  });

const ProfileListWithData = ({ project }) => {
  const obj = useProjectMembers(project.id);
  const members = obj.value;
  return <ProfileList layout="row" glitchTeam={project.showAsGlitchTeam} {...members} />;
};

const ProfileListLoader = ({ project }) => (
  <VisibilityContainer>
    {({ wasEverVisible }) =>
      wasEverVisible ? <ProfileListWithData project={project} /> : <ProfileList layout="row" glitchTeam={project.showAsGlitchTeam} />
    }
  </VisibilityContainer>
);

const ProjectItem = ({ project, projectOptions: providedProjectOptions, collection, noteOptions, showEditButton }) => {
  const { location } = useGlobals();
  const myStuffEnabled = useDevToggle('My Stuff');
  const { currentUser } = useCurrentUser();
  const isAnonymousUser = !currentUser.login;

  const [hasBookmarked, setHasBookmarked] = useState(project.authUserHasBookmarked);
  useEffect(() => {
    setHasBookmarked(project.authUserHasBookmarked);
  }, [project.authUserHasBookmarked]);

  const [isHoveringOnProjectItem, setIsHoveringOnProjectItem] = useState(false);
  const onMouseEnter = () => {
    setIsHoveringOnProjectItem(true);
  };
  const onMouseLeave = () => {
    setIsHoveringOnProjectItem(false);
  };
  const onMyStuffPage = location.pathname.includes('my-stuff');

  const projectOptions = useProjectOptions(project, providedProjectOptions);
  const hasProjectOptions = Object.keys(projectOptions).length > 0;

  const bookmarkAction = useTrackedFunc(
    () => projectOptions.toggleBookmark(project, hasBookmarked, setHasBookmarked),
    `Project ${hasBookmarked ? 'removed from my stuff' : 'added to my stuff'}`,
    (inherited) => ({ ...inherited, projectName: project.domain, baseProjectId: project.baseId || project.baseProject, userId: currentUser.id }),
  );

  const sequence = (doAnimation, projectOption) => {
    if (!projectOption) return undefined;
    return (...args) => {
      doAnimation();
      projectOption(...args);
    };
  };

  console.log(VisibilityContainer);
  return (
    <AnimationContainer animation={slideDown} onAnimationEnd={() => {}}>
      {(doSlideDown) => (
        <AnimationContainer animation={slideUp} onAnimationEnd={() => {}}>
          {(doSlideUp) => {
            const animatedProjectOptions = {
              ...projectOptions,
              addPin: sequence(doSlideUp, projectOptions.addPin),
              removePin: sequence(doSlideDown, projectOptions.removePin),
              deleteProject: sequence(doSlideDown, projectOptions.deleteProject),
              removeProjectFromTeam: sequence(doSlideDown, projectOptions.removeProjectFromTeam),
              featureProject: sequence(doSlideUp, projectOptions.featureProject),
            };

            return (
              <>
                {collection && (
                  <div className={styles.projectsContainerNote} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                    <Note
                      project={project}
                      collection={collection}
                      isAuthorized={noteOptions.isAuthorized}
                      hideNote={noteOptions.hideNote}
                      updateNote={noteOptions.updateNote}
                    />
                  </div>
                )}
                <div className={styles.container} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                  <header className={styles.header}>
                    <div className={classnames(styles.userListContainer, { [styles.spaceForOptions]: hasProjectOptions })}>
                      <ProfileListLoader project={project} />
                    </div>
                    {myStuffEnabled && !isAnonymousUser && !onMyStuffPage && (
                      <div className={styles.bookmarkButtonContainer}>
                        <BookmarkButton
                          action={bookmarkAction}
                          initialIsBookmarked={hasBookmarked}
                          containerDetails={{ isHoveringOnProjectItem }}
                          projectName={project.domain}
                        />
                      </div>
                    )}
                    <div className={styles.projectOptionsContainer}>
                      <ProjectOptionsPop project={project} projectOptions={animatedProjectOptions} />
                    </div>
                  </header>
                  <ProjectLink className={getLinkBodyStyles(project, showEditButton)} project={project}>
                    <div className={styles.projectHeader}>
                      <div className={styles.avatarWrap}>
                        <ProfileAvatar project={project} />
                      </div>
                      <div className={styles.nameWrap}>
                        <div className={styles.itemButtonWrap}>
                          <Button
                            as="span"
                            disabled={!!project.suspendedReason}
                            imagePosition="left"
                          >
                            {project.private && (<span className={styles.privateIcon}><Icon icon="private" alt="private" /></span>)}
                            <span className={styles.projectDomain}>{project.suspendedReason ? 'suspended project' : project.domain}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className={styles.description}>
                      <Markdown length={80}>{project.suspendedReason ? 'suspended project' : project.description || ' '}</Markdown>
                    </div>
                  </ProjectLink>
                  {showEditButton && (
                    <footer className={styles.footer}>
                      <Button variant="secondary" as="a" size="small" href={getEditorUrl(project.domain)}>Edit Project</Button>
                    </footer>
                  )}
                </div>
              </>
            );
          }}
        </AnimationContainer>
      )}
    </AnimationContainer>
  );
};
ProjectItem.propTypes = {
  project: PropTypes.shape({
    description: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    private: PropTypes.bool,
    showAsGlitchTeam: PropTypes.bool.isRequired,
    users: PropTypes.array,
    teams: PropTypes.array,
  }).isRequired,
  projectOptions: PropTypes.object,
  collection: PropTypes.object,
  showEditButton: PropTypes.bool,
};

ProjectItem.defaultProps = {
  projectOptions: {},
  collection: null,
  showEditButton: false,
};

export default ProjectItem;
