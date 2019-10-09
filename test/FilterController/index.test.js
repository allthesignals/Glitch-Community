import React, { createClass } from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chai from 'chai';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import { MemoryRouter } from 'react-router-dom';
import Location from '@jedmao/location';

import FilterController from 'Components/filter-controller';
import ProjectsList from 'Components/containers/projects-list';
import { a11yHelper } from '../reactA11yHelper';
import { makeTestProject, makeTestUser } from '../helpers/models';
import { Provider as ReduxProvider } from 'react-redux';
import { Context as GlobalsContext } from 'State/globals';
import * as ErrorHandlers from 'State/error-handlers';
import * as Notifications from 'State/notifications';
import { context as NotificationContext } from 'State/notifications';
import { ProjectMemberContext } from 'State/project';
import * as VisibilityContainer from 'Components/visibility-container';
import { url } from 'inspector';

chai.should();
const middlewares = [];
const mockStore = configureStore(middlewares);
configure({ adapter: new Adapter() });

class FakeVisibilityContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>{this.props.children({ isVisible: true, wasEverVisible: true })}</div>
    );
  }
}

describe('ProjectsList', function() {
  describe('a11y testing', function() {
    /* before(() => {
      global.IntersectionObserver = class IntersectionObserver {
        constructor() {}
      
        observe() {
          return null;
        }
      
        unobserve() {
          return null;
        }
      };
    }); */

    it('should have no errors when there are no projects', function() {
      a11yHelper.testEnzymeComponent(<ProjectsList layout="row" projects={[]} enableFiltering />, {}, function(results) {
        results.violations.length.should.equal(0);
      });
    });
  });

  it('should contain an input when filtering', function() {
    const wrapper = mount(<ProjectsList layout="row" projects={[]} enableFiltering />);
    console.log(wrapper.find('input').debug());
    // .find(FilterController)
    // .renderProp('children')({
    //   matchFn: (x, y) => x === y,
    // enabled: true,
    // placeholder: "find a project",
    // searchPrompt:"find a project",
    // label:"project search",
    // items:[]});
    return wrapper.exists('input').should.equal(true);
  });

  it('should show projects', function() {
    const projects = [makeTestProject({ id: '1' }), makeTestProject({ id: '2' }), makeTestProject({ id: '3' })];
    const reduxStore = mockStore({ currentUser: makeTestUser({ projects, teams: [] }) });
    const errorStub = sinon.stub(ErrorHandlers, 'default');
    errorStub.returns({ handleError: () => {}, handleCustomError: () => {} });

    const visibilityContainerStub = sinon.stub(VisibilityContainer, 'default');
    visibilityContainerStub.returns(FakeVisibilityContainer);

    

    const getProjectMembers = () => {
      return { value: { teams: [], users: [{ id: 1 }, { id: 2 }] } };
    };
    const componentsToTest = (
      <ProjectMemberContext.Provider value={getProjectMembers}>
        <NotificationContext.Provider value={{ createNotification: () => {}, createErrorNotification: () => {} }}>
          <GlobalsContext.Provider value={{ location: new Location('https://glitch.com/@userpage'), EXTERNAL_ROUTES: [] }}>
            <ReduxProvider store={reduxStore}>
              <MemoryRouter initialEntries={['@userpage']} initialIndex={0}>
                <ProjectsList layout="row" projects={projects} enableFiltering />
              </MemoryRouter>
            </ReduxProvider>
          </GlobalsContext.Provider>
        </NotificationContext.Provider>
      </ProjectMemberContext.Provider>
    );
    const wrapper = mount(componentsToTest);

    wrapper
      .find(ProjectsList)
      .exists('input')
      .should.equal(true);

    a11yHelper.testEnzymeComponent(componentsToTest, {}, function(results) {
      results.violations.length.should.equal(0);
    });
  });
});
