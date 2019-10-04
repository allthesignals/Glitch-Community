const React = require('react');
const {configure, shallow, mount} = require('enzyme');
const expect = require('chai').should();
const FilterController = require('../../src/components/filter-controller').default;
const ProjectsList = require('../../src/components/containers/projects-list').default;
const Adapter = require('enzyme-adapter-react-16');
//import React from 'react';
//import { configure, shallow, mount } from 'enzyme';
//import FilterController from 'Components/filter-controller';

configure({ adapter: new Adapter() });

// a test test - delete when we have real things to test here
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      [1, 2, 3].indexOf(4).should.equal(-1);
    });
  });
});

describe('ProjectsList', function() {
  it('should contain an input when filtering', function() {
    const wrapper = mount(<ProjectsList layout="row" projects={[]} enableFiltering />);
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