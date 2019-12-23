import React from 'react';
import PropTypes from 'prop-types';
import { Actions, Button, Info, Loader, Popover } from '@fogcreek/shared-components';

import ResultsList from 'Components/containers/results-list';
import Link from 'Components/link';
import { ProjectAvatar } from 'Components/images/avatar';
import { getRemixUrl } from 'Models/project';
import { createAPIHook } from 'State/api';

import styles from './styles.styl';
import { mediumPopover } from '../global.styl';

const importGitRepo = () => {
  /* eslint-disable no-alert */
  const repoUrl = window.prompt('Paste the full URL of your repository', 'https://github.com/orgname/reponame.git');
  /* eslint-enable no-alert */
  if (!repoUrl) {
    return;
  }
  window.location.href = `/edit/#!/import/git?url=${repoUrl}`;
};

const NewProjectResultItem = ({ project }) => (
  <div className={styles.project}>
    <div className={styles.projectAvatar}>
      <ProjectAvatar project={project} />
    </div>
    <div className={styles.projectInfo}>
      <div className={styles.projectDomain} title={project.domain}>
        {project.domain}
      </div>
      {project.description.length > 0 && <div className={styles.projectDescription}>{project.description}</div>}
    </div>
  </div>
);

const NewProjectPop = ({ projects }) => (
  <>
    <Actions className={styles.results}>
      {projects.length ? (
        <ResultsList items={projects}>
          {(project) => (
            <Link
              key={project.id}
              to={getRemixUrl(project.domain)}
            >
              <NewProjectResultItem project={project} />
            </Link>
          )}
        </ResultsList>
      ) : (
        <Loader style={{ width: '25px' }} />
      )}
    </Actions>
    <Info>
      <Button size="small" variant="secondary" onClick={importGitRepo} matchBackground>
        Clone from Git Repo
      </Button>
    </Info>
  </>
);
NewProjectPop.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      domain: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const useNewProjectAPI = createAPIHook(async (api) => {
  const projectDomains = ['hello-webpage', 'hello-express', 'hello-sqlite'];
  const domainString = projectDomains.map((domain) => `domain=${domain}`).join('&');
  // always request against the production API, with no token
  // (this is necessary for it to work on glitch.development)
  const { data } = await api.get(`https://api.glitch.com/v1/projects/by/domain?${domainString}`, {
    headers: {
      Authorization: '',
    },
  });
  return projectDomains.map((domain) => data[domain]);
});

function NewProjectPopButton() {
  const { value } = useNewProjectAPI();
  const projects = value || [];

  return (
    <Popover
      className={mediumPopover}
      align="right"
      renderLabel={({ onClick, ref }) => (
        <Button
          onClick={onClick}
          ref={ref}
          size="small"
        >
          New Project
        </Button>
      )}
    >
      {() => <NewProjectPop projects={projects} />}
    </Popover>
  );
}

export default NewProjectPopButton;
