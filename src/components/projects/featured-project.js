import React from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import FeaturedProjectOptionsPop from './pop-overs/featured-project-options-pop';
import ReportButton from './pop-overs/report-abuse-pop';
import { EditButton, RemixButton } from './includes/project-actions';
import AddProjectToCollection from './includes/add-project-to-collection';
import Embed from './includes/embed';
import { TrackClick } from './analytics';


const FeaturedProject = ({ isAuthorized, currentUser, unfeatureProject, addProjectToCollection, featuredProject }) => {
  const reportBtn = (
    <div className="buttons buttons-left">
      <ReportButton className="button-small" reportedType="project" reportedModel={featuredProject} />
    </div>
  );

  const featuredTitle = (
    <>
      Featured Project
      <span className="emoji clapper emoji-in-title" />
    </>
  );

  return (
    <>
      <section id="featured-project-embed">
        <Heading tagName="h2">{featuredTitle}</Heading>

        {isAuthorized && <FeaturedProjectOptionsPop unfeatureProject={unfeatureProject} />}
        <Embed domain={featuredProject.domain} />

        {isAuthorized ? (
          <div className="buttons buttons-left">
            <EditButton name={featuredProject.id} isMember={isAuthorized} size="small" />
          </div>
        ) : (
          reportBtn
        )}

        <div className="buttons buttons-right">
          {currentUser.login && (
            <AddProjectToCollection
              className="button-small"
              currentUser={currentUser}
              project={featuredProject}
              fromProject
              addProjectToCollection={addProjectToCollection}
            />
          )}

          <TrackClick
            name="Click Remix"
            properties={{
              baseProjectId: featuredProject.id,
              baseDomain: featuredProject.domain,
            }}
          >
            <RemixButton name={featuredProject.domain} isMember={isAuthorized} />
          </TrackClick>
        </div>
      </section>
    </>
  );
};

FeaturedProject.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
  unfeatureProject: PropTypes.func.isRequired,
  featuredProject: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
};

FeaturedProject.defaultProps = {
  currentUser: null,
};

export default FeaturedProject;
