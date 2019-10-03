require('react');
const expect = require('chai').should();
require('enzyme');
require('../src/components/filter-controller');
//import React from 'react';
//import { expect } from 'chai';
//import { configure, shallow, mount } from 'enzyme';
//import FilterController from 'Components/filter-controller';

//import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// a test test - delete when we have real things to test here
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      [1, 2, 3].indexOf(4).should.equal(-1);
    });
  });
});

describe('FilterController', function() {
  describe('should render', function() {
    const wrapper = mount(<FilterController />);
    wrapper.find('input').should.be.true;
  })
})