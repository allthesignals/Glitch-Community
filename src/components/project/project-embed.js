import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { Button } from '@fogcreek/shared-components';
import { ProjectAvatar } from 'Components/images/avatar';
import { ProjectLink } from 'Components/link';
import ProfileList from 'Components/profile-list';
import { useProjectMembers } from 'State/project';
import Image from 'Components/images/image';

import Embed from 'Components/project/embed';
import ReportButton from 'Components/report-abuse-pop';
import { EditButton, RemixButton } from 'Components/project/project-actions';
import { useTracker } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { useProjectOptions } from 'State/project-options';
import AddProjectToCollection from './add-project-to-collection-pop';

import styles from './project-embed.styl';

const cx = classNames.bind(styles);
const fullscreenImageURL = 'https://cdn.glitch.com/1b65cd5c-de77-474f-81ed-1b8109651212%2Ffullscreen.svg?v=1571859608927';

const ProfileListWithData = ({ project }) => {
  const { value: members } = useProjectMembers(project.id);
  return <ProfileList layout="row" glitchTeam={project.showAsGlitchTeam} {...members} size="medium" />;
};

const ProjectEmbed = ({ project, top, addProjectToCollection, loading, hideCode }) => {
  const projectOptions = useProjectOptions(project, addProjectToCollection ? { addProjectToCollection } : {});
  const { currentUser } = useCurrentUser();
  const isMember = currentUser.projects.some(({ id }) => id === project.id);
  const trackRemix = useTracker('Click Remix', {
    baseProjectId: project.id,
    baseDomain: project.domain,
  });

  return (
    <section className={styles.projectEmbed}>
      {top}
      <div className={styles.embedWrap}>
        <Embed domain={project.domain} loading={loading} hideCode={hideCode} />
        {hideCode && (
          <div className={styles.embedBottomBar}>
            <span className={styles.embedLeft}>
              <ProjectLink project={project}>
                <ProjectAvatar project={project} />
                <span className={styles.embedDomainLink}>{project.domain}</span>
              </ProjectLink>
              by
              <span className={styles.embedAuthors}>
                <ProfileListWithData project={project} />
              </span>
            </span>
            <Button as="a" href={`https://${project.domain}.glitch.me`}>
              <Image src={fullscreenImageURL} className={styles.fullscreenImg} height="auto" alt="fullscreen" />
            </Button>
          </div>
        )}
      </div>
      <div className={styles.buttonContainer}>
        <div className={styles.left}>
          {isMember ? (
            <EditButton name={project.id} isMember={isMember} size="small" />
          ) : (
            <ReportButton reportedType="project" reportedModel={project} />
          )}
        </div>
        <div className={cx({ right: true, buttonWrap: true })}>
          {projectOptions.addProjectToCollection && (
            <div className={styles.addToCollectionWrap}>
              <AddProjectToCollection project={project} addProjectToCollection={projectOptions.addProjectToCollection} fromProject />
            </div>
          )}
          <RemixButton name={project.domain} isMember={isMember} onClick={trackRemix} />
        </div>
      </div>
    </section>
  );
};

ProjectEmbed.propTypes = {
  project: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func,
  top: PropTypes.any,
  loading: PropTypes.oneOf(['lazy', 'eager', 'auto']),
  hideCode: PropTypes.bool,
};

ProjectEmbed.defaultProps = {
  addProjectToCollection: null,
  top: null,
  loading: 'auto',
  hideCode: false,
};

export default ProjectEmbed;
