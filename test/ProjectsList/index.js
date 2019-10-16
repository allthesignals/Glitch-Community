import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chai from 'chai';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import { MemoryRouter } from 'react-router-dom';
import Location from '@jedmao/location';

import ProjectsList from 'Components/containers/projects-list';
import ProjectItem from 'Components/project/project-item';
import { a11yHelper } from '../reactA11yHelper';
import { makeTestProject, makeTestUser } from '../helpers/models';
import { Provider as ReduxProvider } from 'react-redux';
import { Context as GlobalsContext } from 'State/globals';
import * as ErrorHandlers from 'State/error-handlers';
import { context as NotificationContext } from 'State/notifications';
import { ProjectMemberContext } from 'State/project';
import * as VisibilityContainer from 'Components/visibility-container';

chai.should();
const middlewares = [];
const mockStore = configureStore(middlewares);
configure({ adapter: new Adapter() });

const FakeVisibilityContainer = ({children}) => (<div>{children({ isVisible: true, wasEverVisible: true })}</div>);

describe('ProjectsList', function() {
  describe('a11y testing', function() {
    it('should have no errors when there are no projects', function() {
      a11yHelper.testEnzymeComponent(<ProjectsList layout="row" projects={[]} enableFiltering />, {}, function(results) {
        results.violations.length.should.equal(0);
      });
    });
  });

  it('should show projects', function() {
    const projects = [makeTestProject({ id: '1', domain: 'first-project' }), makeTestProject({ id: '2', description: 'hello project!' }), makeTestProject({ id: '3' })];
    const reduxStore = mockStore({ currentUser: makeTestUser({ projects, teams: [] }) });
    const errorStub = sinon.stub(ErrorHandlers, 'default');
    errorStub.returns({ handleError: () => {}, handleCustomError: () => {} });

    const visibilityContainerStub = sinon.stub(VisibilityContainer, 'default');
    visibilityContainerStub.callsFake((props) => new FakeVisibilityContainer(props));

    const getProjectMembers = () => {
      return { value: { teams: [], users: [{ id: 1 }, { id: 2 }] } };
    };
    const componentsToTest = (
      <ProjectMemberContext.Provider value={getProjectMembers}>
        <NotificationContext.Provider value={{ createNotification: () => {}, createErrorNotification: () => {} }}>
          <GlobalsContext.Provider value={{ location: new Location('https://glitch.com/@userpage'), EXTERNAL_ROUTES: [] }}>
            <ReduxProvider store={reduxStore}>
              <MemoryRouter initialEntries={['@userpage']} initialIndex={0}>
                <ProjectsList layout="row" projects={projects} enableFiltering debounceFunction={(arg) => arg} />
              </MemoryRouter>
            </ReduxProvider>
          </GlobalsContext.Provider>
        </NotificationContext.Provider>
      </ProjectMemberContext.Provider>
    );
    const wrapper = mount(componentsToTest);
      
    const projectItems = wrapper.find(ProjectItem);

    const findProject = (projectName) => {
      return projectItems.findWhere((node) => {
        const componentProps = node.props();
        return componentProps.project && componentProps.project.domain === 'first-project';
      });
    }
    const firstProjectItem = findProject('first-project');
    firstProjectItem.exists().should.equal(true);

    const helloProjectItem = findProject('hello-project');
    helloProjectItem.exists().should.equal(true);

    wrapper
      .find(ProjectsList)
      .find("input[type='search']")
      .simulate('change', { target: { value: 'hello' } });

   const projectItemsAfterFilter = wrapper.find(ProjectItem);
    const projectItemThatNoLongerExists = projectItemsAfterFilter.findWhere((node) => {
      const componentProps = node.props();
      return componentProps.project && componentProps.project.domain === 'first-project';
    });
    projectItemThatNoLongerExists.exists().should.equal(false);

    a11yHelper.testEnzymeComponent(componentsToTest, {}, function(results) {
      results.violations.length.should.equal(0);
    });
  });
});
