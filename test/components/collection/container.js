import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { CollectionContainerWithHooksPassedIn } from 'Components/collection/container';
import { BookmarkAvatar, StarAvatar } from 'Components/images/avatar';
import AuthDescription from 'Components/fields/auth-description';

describe('CollectionContainer', function() {
  beforeEach(() => {
    this.props = {
      collection: {
        projects: [],
        coverColor: "aliceblue",
        name: "Collection name",
        description: ""
      },
      isAuthorized: true,
      funcs: {
        onNameChange: () => {}
      },
      match: {
        params: []
      }
    };
  });

  context('when collection.isMystuff is true', () => {
    beforeEach(() => {
      this.props.collection.isMyStuff = true;
      this.props.collection.isProtectedCollection = true;
    });

    it('renders a BookmarkAvatar', () => {
      const wrapper = shallow(<CollectionContainerWithHooksPassedIn {...this.props} />);
      expect(wrapper.find(BookmarkAvatar)).to.exist;
    });
  });

  context('when collection.isProtectedCollection is true', () => {
    beforeEach(() => {
      this.props.collection.isMyStuff = false;
      this.props.collection.isProtectedCollection = true;
    });

    it('renders a StarAvatar', () => {
      const wrapper = shallow(<CollectionContainerWithHooksPassedIn {...this.props} />);
      expect(wrapper.find(StarAvatar)).to.exist;
    });

    it("renders AuthDescription with props.authorized set to false", () => {
      const wrapper = shallow(<CollectionContainerWithHooksPassedIn {...this.props} />);
      expect(wrapper.find(AuthDescription).props().authorized).to.be.false
    })
  });
});
