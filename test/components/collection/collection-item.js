import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import CollectionItem from 'Components/collection/collection-item';
import { StarAvatar } from 'Components/images/avatar';
import CollectionOptions from 'Components/collection/collection-options-pop';

import MockContext from '../../helpers/mockContext';

describe('CollectionItem', function() {
  beforeEach(() => {
    this.props = {
      collection: {
        id: 1,
        name: '',
        description: '',
        coverColor: '',
        fullUrl: '',
      },
      deleteCollection: () => {},
      isAuthorized: true,
    };
  });

  context('when collection.isProtectedCollection is true', () => {
    beforeEach(() => {
      this.props.collection.isProtectedCollection = true;
    });

    it('shows a star avatar', () => {
      const wrapper = mount(
        <MockContext
          currentUser={{ id: 1 }}
          location={'collectionPage'}
          getCollectionProjects={() => {
            return [];
          }}
        >
          <CollectionItem {...this.props} />
        </MockContext>,
      );

      expect(wrapper.find(StarAvatar).length).to.equal(1);
    });

    it('does not render a collection options dropdown', () => {
      const wrapper = mount(
        <MockContext
          currentUser={{ id: 1 }}
          location={'collectionPage'}
          getCollectionProjects={() => {
            return [];
          }}
        >
          <CollectionItem {...this.props} />
        </MockContext>,
      );

      expect(wrapper.find(CollectionOptions).length).to.equal(0);
    });
  });

  context('when collection.isProtectedCollection is false', () => {
    beforeEach(() => {
      this.props.collection.isProtectedCollection = false;
    });

    it('does not show a star avatar', () => {
      const wrapper = mount(
        <MockContext
          currentUser={{ id: 1 }}
          location={'collectionPage'}
          getCollectionProjects={() => {
            return [];
          }}
        >
          <CollectionItem {...this.props} />
        </MockContext>,
      );

      expect(wrapper.find(StarAvatar).length).to.equal(0);
    });

    it('renders a collection options dropdown', () => {
      const wrapper = mount(
        <MockContext
          currentUser={{ id: 1 }}
          location={'collectionPage'}
          getCollectionProjects={() => {
            return [];
          }}
        >
          <CollectionItem {...this.props} />
        </MockContext>,
      );

      expect(wrapper.find(CollectionOptions).length).to.equal(1);
    });
  });
});
