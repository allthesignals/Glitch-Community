import React from 'react';
import PropTypes from 'prop-types';

import {TruncatedMarkdown} from './includes/markdown.jsx';
import ProjectModel from '../models/project';
import CollectionOptionsContainer from "./pop-overs/collection-options-pop.jsx";
import UsersList from "./users-list.jsx";

import SVGInline from "react-svg-inline";

import Loader, {DataLoader} from './includes/loader.jsx';
import ProjectsLoader from './projects-loader.jsx';

import {getAvatarUrl, getLink} from '../models/project.js';

import UserModel from '../models/user'; 

import {colors, hexToRgbA, avatars, getContrastTextColor, defaultAvatarSVG} from '../models/collection.js'; 

class Avatar extends React.Component{
  constructor(props){
    super(props);
    this.state={
      backgroundColor: this.props.backgroundColor
    };
  }
  componentDidMount(){
    // set background color in SVG
    let collectionId = "#collection-" + this.props.collectionId;
    let selector = collectionId + " svg .background";
    let svgBackgroundEl = document.querySelector(selector);
    svgBackgroundEl.setAttribute('fill', this.state.backgroundColor);
  }
  render(){
    return(
      <SVGInline svg={defaultAvatarSVG}/>
    );
  }
}

Avatar.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  collectionId: PropTypes.number.isRequired,
}

const ProjectsPreview = ({projects, color, collection}) => {
  
  return (
    <React.Fragment>
      <div className="projects-preview" projects={projects}>
        { projects.slice(0,3).map(project => (
          <div className="project-container" style={{backgroundColor: color}}>
            <img className="avatar" src={getAvatarUrl(project.id)}/>
            <div className="project-name" style={{color: getContrastTextColor(color)}}>{project.domain}</div>
          </div>
        )) }
      </div>
      <div className="collection-link">
          View {projects.length} {(projects.length > 0 ? 'projects' : 'project')} →
      </div>
    </React.Fragment>
  );
};

ProjectsPreview.propTypes = {
  projects: PropTypes.any.isRequired,
  color: PropTypes.string.isRequired,
};

async function getCollectionUrl(api, userId, collectionUrl){
  const {data} = await api.get(`users/${userId}`);
  const username = data.login;
  let path = `/@${username}/${collectionUrl}`;
  return path;
}

async function loadCollection(api, id){
  const {data} = await api.get(`collections/${id}`);
  if(data){
    data.projects = data.projects.map(project => ProjectModel(project).update(project).asProps());
  }
  return data;
}

class CollectionItem extends React.Component{
  constructor(props){
    super(props);
  }
  
  render(){
      const {collection, categoryColor, deleteCollection, api, isAuthorized} = this.props;
  return (
      <li>
        <CollectionOptionsContainer collection={collection} deleteCollection={deleteCollection}></CollectionOptionsContainer>

        {(collection  &&
          <DataLoader
            get={() => getCollectionUrl(api, collection.userId, collection.url)}
            renderLoader={() => <Loader />}
            renderError={() => <div>Something went wrong. Try refreshing?</div>}
          >
            {path => (
              <a href={path}>
                <div className={['collection']} 
                  id={"collection-" + collection.id}
                  style={{backgroundColor: hexToRgbA(collection.coverColor), borderBottomColor: hexToRgbA(collection.coverColor)}}>
                  <div className="collection-container">
                    <div className="collection-info">
                      <div className="avatar-container">
                        <div className="avatar">
                          <Avatar backgroundColor={collection.coverColor} collectionId={collection.id}/>
                        </div>
                      </div>
                      <div className="collection-name-description">
                        <div className="button">
                          <span className="project-badge private-project-badge" aria-label="private"></span>
                          <div className="project-name">{collection.name}</div>
                        </div>
                        <div className="description"><TruncatedMarkdown length={96}>{collection.description}</TruncatedMarkdown></div>
                      </div>

                      <div className="overflow-mask"></div>
                    </div>

                    {(collection.projects.length > 0
                      ? <ProjectsPreview projects={collection.projects} color={collection.coverColor} collection={collection}/>
                      :
                      <div className="projects-preview empty">
                        {(isAuthorized
                          ? <p>This collection is empty.  Add some projects to it! ☝️</p>
                          : "No projects to see in this collection just yet."
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </a>             
            )}
          </DataLoader>
        )}
      </li>
    );
    }
}

CollectionItem.propTypes = {
  api: PropTypes.func.isRequired,
  categoryColor: PropTypes.string,
  isAuthorized: PropTypes.bool.isRequired,
  deleteCollection: PropTypes.func
};

export default CollectionItem;