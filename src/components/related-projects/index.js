import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { sampleSize } from 'lodash';
import { Icon } from '@fogcreek/shared-components';

import ProjectsList from 'Components/containers/projects-list';
import CoverContainer from 'Components/containers/cover-container';
import DataLoader from 'Components/data-loader';
import { TeamLink, UserLink } from 'Components/link';
import { getDisplayName } from 'Models/user';
import useSample from 'Hooks/use-sample';
import styles from './styles.styl';

const PROJECT_COUNT = 3;

const RelatedProjectsBody = ({ projects, type, item }) =>
  projects.length > 0 ? (
    <CoverContainer type={type} item={item}>
      <div className={styles.projectsWrap}>
        <ProjectsList layout="row" projects={projects} />
      </div>
    </CoverContainer>
  ) : null;

RelatedProjectsBody.propTypes = {
  projects: PropTypes.array.isRequired,
};

async function getProjects(api, { type, id, ignoreProjectId }) {
  let [pins, recents] = await Promise.all([
    api.get(`/v1/${type}s/by/id/pinnedProjects?id=${id}`).then((res) => res.data.items),
    api.get(`/v1/${type}s/by/id/projects?id=${id}`).then((res) => res.data.items),
  ]);

  pins = pins.filter((project) => project.id !== ignoreProjectId);
  const sampledPins = sampleSize(pins, PROJECT_COUNT);
  const sampledPinIDs = sampledPins.map((project) => project.id);

  recents = recents.filter((project) => project.id !== ignoreProjectId && !sampledPinIDs.includes(project.id));
  const sampledRecents = sampleSize(recents, PROJECT_COUNT - sampledPins.length);
  return [...sampledPins, ...sampledRecents];
}

const ProjectsDataLoader = ({ children, type, id, ignoreProjectId }) => {
  const args = useMemo(() => ({ type, id, ignoreProjectId }), [type, id, ignoreProjectId]);
  return (
    <DataLoader get={getProjects} args={args}>
      {(projects) => projects && projects.length > 0 && children(projects)}
    </DataLoader>
  );
};

const RelatedProjects = ({ project }) => {
  const teams = useSample(project.teams || [], 1);
  const users = useSample(project.users || [], 2 - teams.length);

  if (!teams.length && !users.length) {
    return null;
  }
  return (
    <ul className={styles.container}>
      {teams.map((team) => (
        <li key={team.id}>
          <ProjectsDataLoader type="team" id={team.id} ignoreProjectId={project.id}>
            {(projects) => (
              <>
                <h2>
                  <TeamLink team={team}>More by {team.name} <Icon className={styles.arrow} icon="arrowRight" /></TeamLink>
                </h2>
                <RelatedProjectsBody projects={projects} type="team" item={team} />
              </>
            )}
          </ProjectsDataLoader>
        </li>
      ))}
      {users.map((user) => (
        <li key={user.id}>
          <ProjectsDataLoader type="user" id={user.id} ignoreProjectId={project.id}>
            {(projects) => (
              <>
                <h2>
                  <UserLink user={user}>More by {getDisplayName(user)} <Icon className={styles.arrow} icon="arrowRight" /></UserLink>
                </h2>
                <RelatedProjectsBody projects={projects} type="user" item={user} />
              </>
            )}
          </ProjectsDataLoader>
        </li>
      ))}
    </ul>
  );
};
RelatedProjects.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    teams: PropTypes.array,
    users: PropTypes.array,
  }).isRequired,
};

export default RelatedProjects;
