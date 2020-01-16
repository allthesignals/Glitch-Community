import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import AddCollectionProject from 'Components/collection/add-collection-project-pop';
import MockContext from '../../helpers/mockContext';

describe('AddCollectionProject', function() {
  beforeEach(() => {
    this.props = {};
  });

  context("when the collection has hit maxProjects", () => {
    beforeEach(() => {
      this.props.collection = {
        maxProjects: 2,
        projects: ["fake", "projects"]
      };
      this.props.addProjectToCollection = () => {}
    });
    it('renders a disabled button', () => {
      const wrapper = mount(
        <MockContext currentUser={{ id: 1 }} location={'collectionPage'}>
          <AddCollectionProject {...this.props} />
        </MockContext>,
      );

      const buttonIsDisabled = wrapper.find('[data-test="add-project-to-collection-btn"]').first().props().disabled
      expect(buttonIsDisabled).to.equal(true);
    });
  });

  context("when the collection has not hit maxProjects", () => {
    beforeEach(() => {
      this.props.collection = {
        maxProjects: 3,
        projects: ["fake", "projects"]
      };
      this.props.addProjectToCollection = () => {}
    });
    it('renders a button where disabled is false', () => {
      const wrapper = mount(
        <MockContext currentUser={{ id: 1 }} location={'collectionPage'}>
          <AddCollectionProject {...this.props} />
        </MockContext>,
      );

      const buttonIsDisabled = wrapper.find('[data-test="add-project-to-collection-btn"]').first().props().disabled
      expect(buttonIsDisabled).to.equal(false);
    });
  });
});
