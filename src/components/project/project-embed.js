import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Embed from 'Components/project/embed';
import ReportButton from 'Components/report-abuse-pop';
import { EditButton, RemixButton } from 'Components/project/project-actions';
import { useTracker } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { useProjectOptions } from 'State/project-options';
import AddProjectToCollection from './add-project-to-collection-pop';

import styles from './project-embed.styl';

const cx = classNames.bind(styles);

const ProjectEmbed = ({ project, top, addProjectToCollection, loading }) => {
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
        <Embed domain={project.domain} loading={loading} />
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
};

ProjectEmbed.defaultProps = {
  addProjectToCollection: null,
  top: null,
  loading: 'auto',
};

export default ProjectEmbed;
