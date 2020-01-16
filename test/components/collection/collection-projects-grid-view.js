import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import CollectionProjectsGridView from 'Components/collection/collection-projects-grid-view';

describe('CollectionProjectsGridView', function() {
  const renderAndFindTestAttribute = (testDataAttribute) => {
    const wrapper = shallow(<CollectionProjectsGridView {...this.props} />);
    return wrapper.find(`[data-test="${testDataAttribute}"]`);
  };

  beforeEach(() => {
    this.props = {
      collection: {
        projects: [],
      },
      isAuthorized: true,
      funcs: {},
    };
  });

  context('when collection.maxProjects is not null', () => {
    beforeEach(() => {
      this.props.collection.maxProjects = 2;
    });

    it('renders a count', () => {
      const maxProjectCount = renderAndFindTestAttribute('max-project-count');

      expect(maxProjectCount.length).to.equal(1);
    });

    context('and when the maxProjects limit has been reached', () => {
      beforeEach(() => {
        this.props.collection.projects = [{ id: 'first' }, { id: 'second' }];
      });
      it('renders a warning', () => {
        const maxProjectWarning = renderAndFindTestAttribute('max-project-warning');
        expect(maxProjectWarning.length).to.equal(1);
      });
    });

    context('and when the maxProjects limit has NOT been reached', () => {
      beforeEach(() => {
        this.props.collection.projects = [{ id: 'just the one' }];
      });
      it('does NOT render a warning', () => {
        const maxProjectWarning = renderAndFindTestAttribute('max-project-warning');

        expect(maxProjectWarning.length).to.equal(0);
      });
    });
  });

  context('when collection.maxProjects is null', () => {
    beforeEach(() => {
      this.props.collection.maxProjects = null;
    });

    it('does not render a count', () => {
      const maxProjectCount = renderAndFindTestAttribute('max-project-count');
      expect(maxProjectCount.length).to.equal(0);
    });
  });

  context('when collection.projects is empty and the user is authorized', () => {
    context('and when collection.mustBeProjectOwner is true', () => {
      beforeEach(() => {
        this.props.collection.mustBeProjectOwner = true;
      });
      it('renders the right explaination text', () => {
        const explainationText = renderAndFindTestAttribute('must-be-project-owner-explaination');
        expect(explainationText.length).to.equal(1);
      });
    });

    context('and when collection.mustBeProjectOwner is false', () => {
      beforeEach(() => {
        this.props.collection.mustBeProjectOwner = false;
      });
      it('renders the right explaination text', () => {
        const explainationText = renderAndFindTestAttribute('empty-projects-explaination');
        expect(explainationText.length).to.equal(1);
      });
    });
  });
});
