import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Markdown from 'Components/text/markdown';
import ProfileList from 'Components/profile-list';
import VisibilityContainer from 'Components/visibility-container';
import { ResultItem, ResultInfo, ResultName, ResultDescription } from '@fogcreek/shared-components';
import { ProjectAvatar } from 'Components/images/avatar';
import { useProjectMembers } from 'State/project';

import styles from './project-result-item.styl';

const ProfileListWithData = ({ project, asLinks }) => {
  const { value: members } = useProjectMembers(project.id);
  return <ProfileList {...members} layout="row" size="small" asLinks={asLinks} />;
};

const ProfileListWrap = ({ project, asLinks }) => (
  <div className={styles.profileListWrap}>
    <VisibilityContainer>
      {({ wasEverVisible }) => (wasEverVisible ? <ProfileListWithData project={project} asLinks={asLinks} /> : <ProfileList layout="row" size="small" asLinks={asLinks} />)}
    </VisibilityContainer>
  </div>
);

const ProjectResultItem = ({ project, onClick, profileListAsLinks, buttonProps, isALink }) => {
  const linkProps = isALink ? { as: 'a', href: `/~${project.domain}`, target: '_blank' } : {};
  return (
    <ResultItem className={classnames(project.private && styles.private)} onClick={() => onClick(project)} {...buttonProps} {...linkProps}>
      <div>
        <ProjectAvatar project={project} />
      </div>
      <ResultInfo>
        <ResultName>{project.domain}</ResultName>
        {project.description.length > 0 && (
          <ResultDescription>
            <Markdown renderAsPlaintext>{project.description}</Markdown>
          </ResultDescription>
        )}
        <ProfileListWrap project={project} asLinks={profileListAsLinks} />
      </ResultInfo>
    </ResultItem>
  );
};

ProjectResultItem.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    private: PropTypes.bool,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  profileListAsLinks: PropTypes.bool,
  isALink: PropTypes.bool,
};

ProjectResultItem.defaultProps = {
  profileListAsLinks: true,
  isALink: false,
};

export default ProjectResultItem;
