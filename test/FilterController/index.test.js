import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import chai from 'chai';

import FilterController from 'Components/filter-controller';
import ProjectsList from 'Components/containers/projects-list';
import { a11yHelper } from '../reactA11yHelper';

chai.should();

configure({ adapter: new Adapter() });

describe('ProjectsList', function() {
  describe('a11y testing', function() {
    it('should have no errors when there are no projects', function() {
      a11yHelper.testEnzymeComponent(<ProjectsList layout="row" projects={[]} enableFiltering />, {}, function (results) {
        results.violations.length.should.equal(0);
      });
    });
    it('should have no errors when there are projects', function() {
      a11yHelper.testEnzymeComponent(<ProjectsList layout="row" projects={[]} enableFiltering />, {}, function (results) {
        results.violations.length.should.equal(0);
      });
    })
  
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
})