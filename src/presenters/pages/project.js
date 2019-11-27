import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Actions, Button, DangerZone, Icon, Loader, Popover } from '@fogcreek/shared-components';

import Heading from 'Components/text/heading';
import Markdown from 'Components/text/markdown';
import NotFound from 'Components/errors/not-found';
import GlitchHelmet from 'Components/glitch-helmet';
import CollectionItem from 'Components/collection/collection-item';
import ProjectEmbed from 'Components/project/project-embed';
import OptimisticTextInput from 'Components/fields/optimistic-text-input';
import { ProjectProfileContainer } from 'Components/containers/profile';
import DataLoader from 'Components/data-loader';
import Row from 'Components/containers/row';
import RelatedProjects from 'Components/related-projects';
import Expander from 'Components/containers/expander';
import { ShowButton, EditButtonCta } from 'Components/project/project-actions';
import AuthDescription from 'Components/fields/auth-description';
import Layout from 'Components/layout';
import { PrivateBadge, PrivateToggle } from 'Components/private-badge';
import BookmarkButton from 'Components/buttons/bookmark-button';
import { AnalyticsContext, useTrackedFunc } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { useToggleBookmark } from 'State/collection';
import { useProjectEditor, useProjectMembers } from 'State/project';
import { getUserLink } from 'Models/user';
import { userIsProjectMember, userIsProjectAdmin, getProjectLink, getProjectAvatarUrl, SUSPENDED_AVATAR_URL } from 'Models/project';
import { getAllPages } from 'Shared/api';
import useFocusFirst from 'Hooks/use-focus-first';
import { useAPIHandlers } from 'State/api';
import { useCachedProject } from 'State/api-cache';
import { tagline } from 'Utils/constants';
import { renderText } from 'Utils/markdown';
import { addBreadcrumb } from 'Utils/sentry';
import ProjectUsers from 'Components/project/project-user';
import styles from './project.styl';
import { emoji } from '../../components/global.styl';

function syncPageToDomain(domain) {
  history.replaceState(null, null, `/~${domain}`);
}

const filteredCollections = (collections) => collections.filter((c) => (c.user || c.team) && !c.isMyStuff);

const IncludedInCollections = ({ projectId }) => (
  <DataLoader get={(api) => getAllPages(api, `/v1/projects/by/id/collections?id=${projectId}&limit=100`)} renderLoader={() => null}>
    {(collections) =>
      filteredCollections(collections).length > 0 && (
        <>
          <Heading tagName="h2">Included in Collections</Heading>
          <Row items={filteredCollections(collections)} gap="20px">
            {(collection) => <CollectionItem collection={collection} showCurator />}
          </Row>
        </>
      )
    }
  </DataLoader>
);

const getReadme = (api, domain) => api.get(`projects/${domain}/readme`);
const ReadmeError = (error) =>
  error && error.response && error.response.status === 404 ? (
    <>
      This project would be even better with a <code>README.md</code>
    </>
  ) : (
    <>We couldn't load the readme. Try refreshing?</>
  );
const ReadmeLoader = ({ domain }) => {
  const location = useLocation();
  return (
    <DataLoader get={getReadme} args={domain} renderError={ReadmeError}>
      {({ data }) =>
        location.hash ? (
          <Markdown linkifyHeadings>{data.toString()}</Markdown>
        ) : (
          <Expander height={location.hash ? Infinity : 250}>
            <Markdown linkifyHeadings>{data.toString()}</Markdown>
          </Expander>
        )
      }
    </DataLoader>
  );
};

ReadmeLoader.propTypes = {
  domain: PropTypes.string.isRequired,
};

function DeleteProjectPopover({ projectDomain, deleteProject }) {
  const { currentUser } = useCurrentUser();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (done) {
      window.location = getUserLink(currentUser);
    }
  }, [done, currentUser]);

  return (
    <section>
      <Popover align="left" renderLabel={({ onClick, ref }) => <Button size="small" variant="secondary" onClick={onClick} ref={ref}>Delete Project <Icon className={emoji} icon="bomb" /></Button>}>
        {({ onClose }) => (
          <>
            <Actions>
              <p>You can always undelete a project from your profile page.</p>
            </Actions>
            <DangerZone>
              {loading ? (
                <Loader />
              ) : (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    setLoading(true);
                    deleteProject().then(() => {
                      onClose();
                      setDone(true);
                    });
                  }}
                >
                  Delete {projectDomain} <Icon className={emoji} icon="bomb" />
                </Button>
              )}
            </DangerZone>
          </>
        )}
      </Popover>
    </section>
  );
}

DeleteProjectPopover.propTypes = {
  deleteProject: PropTypes.func.isRequired,
};

const ProjectPage = ({ project: initialProject }) => {
  const [project, { updateDomain, updateDescription, updatePrivate, deleteProject, uploadAvatar, reassignAdmin }] = useProjectEditor(initialProject);
  useFocusFirst();
  const { currentUser } = useCurrentUser();
  const [hasBookmarked, toggleBookmark, setHasBookmarked] = useToggleBookmark(project);
  const isAnonymousUser = !currentUser.login;
  const { value: members } = useProjectMembers(project.id);
  const isAuthorized = userIsProjectMember({ members, user: currentUser });
  const isAdmin = userIsProjectAdmin({ project, user: currentUser });
  const { domain, users, teams, suspendedReason } = project;
  const updateDomainAndSync = (newDomain) => updateDomain(newDomain).then(() => syncPageToDomain(newDomain));

  const { addProjectToCollection } = useAPIHandlers();

  const bookmarkAction = useTrackedFunc(toggleBookmark, 'My Stuff Button Clicked', (inherited) => ({
    ...inherited,
    projectName: project.domain,
    baseProjectId: project.baseId,
    userId: currentUser.id,
    isAddingToMyStuff: !hasBookmarked,
  }));

  const addProjectToCollectionAndSetHasBookmarked = (projectToAdd, collection) => {
    if (collection.isMyStuff) {
      setHasBookmarked(true);
    }
    return addProjectToCollection({ project: projectToAdd, collection });
  };

  const seoDescription = React.useMemo(() => {
    const helloTemplateDescriptions = new Set([
      'Your very own basic web page, ready for you to customize.',
      'A simple Node app built on Express, instantly up and running.',
      'A simple Node app with a SQLite database to hold app data.',
    ]);
    const defaultProjectDescriptionPattern = /(A|The) [a-z]{2,} project that does [a-z]{2,} things/g;
    const usesDefaultDescription = helloTemplateDescriptions.has(project.description) || defaultProjectDescriptionPattern.test(project.description);
    if (!project.description || usesDefaultDescription || project.suspendedReason) {
      return `Check out ~${project.domain} on Glitch, the ${tagline}`;
    }
    return `${renderText(project.description)} 🎏 Glitch is the ${tagline}`;
  }, [project.domain, project.description, project.suspendedReason, tagline]);

  return (
    <main id="main" aria-label="Glitch Project Page">
      <GlitchHelmet
        title={project.domain}
        description={seoDescription}
        image={project.suspendedReason ? SUSPENDED_AVATAR_URL : getProjectAvatarUrl(project)}
        canonicalUrl={getProjectLink(project)}
      />
      <section id="info">
        <ProjectProfileContainer
          currentUser={currentUser}
          project={project}
          isAuthorized={isAuthorized}
          avatarActions={{
            'Upload Avatar': isAuthorized ? uploadAvatar : null,
          }}
        >
          {isAuthorized ? (
            <>
              <div className={styles.headingWrap}>
                <Heading tagName="h1">
                  <OptimisticTextInput label="Project Domain" value={project.domain} onChange={updateDomainAndSync} placeholder="Name your project" />
                </Heading>
                {!isAnonymousUser && (
                  <div className={styles.bookmarkButton}>
                    <BookmarkButton action={bookmarkAction} initialIsBookmarked={hasBookmarked} projectName={project.domain} />
                  </div>
                )}
              </div>
              <div className={styles.privacyToggle}>
                <PrivateToggle type="project" isPrivate={!!project.private} setPrivate={updatePrivate} />
              </div>
            </>
          ) : (
            <>
              <div className={styles.headingWrap}>
                <Heading tagName="h1">{!currentUser.isSupport && suspendedReason ? 'suspended project' : domain}</Heading>
                {!isAnonymousUser && (
                  <div className={styles.bookmarkButton}>
                    <BookmarkButton action={bookmarkAction} initialIsBookmarked={hasBookmarked} projectName={project.domain} />
                  </div>
                )}
              </div>
              {project.private && (
                <div className={styles.privacyToggle}>
                  <PrivateBadge type="project" />
                </div>
              )}
            </>
          )}
          {users.length + teams.length > 0 && (
            <div>
              <ProjectUsers users={users} project={project} reassignAdmin={reassignAdmin} />
            </div>
          )}
          <AuthDescription
            authorized={isAuthorized}
            description={!currentUser.isSupport && !isAuthorized && suspendedReason ? 'suspended project' : project.description}
            update={updateDescription}
            placeholder="Tell us about your app"
          />
          <div>
            <span className={styles.profileButton}>
              <ShowButton name={domain} />
            </span>
            <span className={styles.profileButton}>
              <EditButtonCta name={domain} isMember={isAuthorized} />
            </span>
          </div>
        </ProjectProfileContainer>
      </section>
      <div className={styles.projectEmbedWrap}>
        <ProjectEmbed project={project} addProjectToCollection={addProjectToCollectionAndSetHasBookmarked} />
      </div>
      <section id="readme">
        <ReadmeLoader domain={domain} />
      </section>

      {isAdmin && <DeleteProjectPopover projectDomain={project.domain} currentUser={currentUser} deleteProject={deleteProject} />}

      <section id="included-in-collections">
        <IncludedInCollections projectId={project.id} />
      </section>
      <section id="related">
        <RelatedProjects project={project} />
      </section>
    </main>
  );
};
ProjectPage.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    private: PropTypes.bool,
    domain: PropTypes.string.isRequired,
    teams: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
  }).isRequired,
};

async function addProjectBreadcrumb(projectWithMembers) {
  const { users, teams, ...project } = projectWithMembers;
  addBreadcrumb({
    level: 'info',
    message: `project: ${JSON.stringify(project)}`,
  });
  return projectWithMembers;
}

const ProjectPageContainer = ({ name: domain }) => {
  const { status, value: project } = useCachedProject(domain);
  useEffect(() => {
    if (project) addProjectBreadcrumb(project);
  }, [project]);
  return (
    <Layout>
      <AnalyticsContext properties={{ origin: 'project' }}>
        {project ? (
          <ProjectPage project={project} />
        ) : (
          <>
            <GlitchHelmet title={domain} description={`We couldn't find ~${domain}`} />
            {status === 'ready' && <NotFound name={domain} />}
            {status === 'loading' && <Loader style={{ width: '25px' }} />}
            {status === 'error' && <NotFound name={domain} />}
          </>
        )}
      </AnalyticsContext>
    </Layout>
  );
};

export default ProjectPageContainer;
