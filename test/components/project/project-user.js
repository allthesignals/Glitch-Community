import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { Popover, UnstyledButton, Button } from '@fogcreek/shared-components';
import ProjectUser, { PermissionsPopover } from 'Components/project/project-user';
import { UserLink } from 'Components/link';
import MockContext from '../../helpers/mockContext';
import styles from '../../../src/components/project/project-user.styl';

describe('ProjectUser', function() {
  beforeEach(() => {
    this.props = {
      users: [
        { id: 1, permission: { accessLevel: 20 } },
        { id: 2, permission: { accessLevel: 30 } },
      ],
      project: {
        permissions: [
          { userId: 1, permission: { accessLevel: 20 } },
          { userId: 2, permission: { accessLevel: 30 } },
        ]
      },
      reassignAdmin: () => {},
    };
  });

  context("if the current user is a member of the project", () => {
    it('renders a popover button for each user', () => {
      const wrapper = mount(
        <MockContext currentUser={{ id: 1 }} location={'~projectPage'}>
          <ProjectUser {...this.props} />
        </MockContext>,
      );
      expect(wrapper.find(Popover)).to.have.lengthOf(2);
    });
  });

  context("if the current user is NOT a member of the project", () => {
    it('renders a link for each user', () => {
      const wrapper = mount(
        <MockContext currentUser={{ id: "some other id" }} location={'~projectPage'}>
          <ProjectUser {...this.props} />
        </MockContext>,
      );
      expect(wrapper.find(Popover)).to.have.lengthOf(0);
      expect(wrapper.find(UserLink)).to.have.lengthOf(2);
    });
  });

  context('when the popover button is clicked', () => {
    it('renders a permissions popover', () => {
      const wrapper = mount(
        <MockContext currentUser={{ id: 1 }} location={'~projectPage'}>
          <ProjectUser {...this.props} />
        </MockContext>,
      );
      wrapper.find(UnstyledButton).first().simulate('click');
      expect(wrapper.find(PermissionsPopover)).to.have.lengthOf(1);
    });
  });
});

describe('PermissionsPopover', function() {
  context('when the user in the popover is anonymous', () => {
    beforeEach(() => {
      const props = {
        user: { id: 1 },
        project: { permissions: [] },
        reassignAdmin: () => {},
      };
      this.wrapper = mount(
        <MockContext currentUser={{ id: 1 }} location={'~projectPage'}>
          <PermissionsPopover {...props} />
        </MockContext>,
      );
    });
    it('does not render a login', () => {
      expect(this.wrapper.find(`.${styles.userLogin}`)).to.have.lengthOf(0);
    });
    it('renders the word anonymous', () => {
      expect(this.wrapper.find(`.${styles.userName}`).text()).to.equal('Anonymous');
    });
  });
  context('when the user in the popover has a login and name', () => {
    beforeEach(() => {
      const props = {
        user: { id: 1, login: 'glitchWitch', name: 'Glinda the Witch' },
        project: { permissions: [] },
        reassignAdmin: () => {},
      };
      this.wrapper = mount(
        <MockContext currentUser={{ id: 1 }} location={'~projectPage'}>
          <PermissionsPopover {...props} />
        </MockContext>,
      );
    });
    it('renders the @login', () => {
      expect(this.wrapper.find(`.${styles.userLogin}`).text()).to.equal('@glitchWitch');
    });
    it('renders the name of the user', () => {
      expect(this.wrapper.find(`.${styles.userName}`).text()).to.equal('Glinda the Witch');
    });
  });
  context('when the user in the popover is the admin', () => {
    it('renders an admin badge', () => {
      const props = {
        user: { id: 1, login: 'glitchWitch', name: 'Glinda the Witch' },
        project: {
          permissions: [
            {
              userId: 1,
              accessLevel: 30,
            },
          ],
        },
        reassignAdmin: () => {},
      };
      const wrapper = mount(
        <MockContext currentUser={{ id: 1 }} location={'~projectPage'}>
          <PermissionsPopover {...props} />
        </MockContext>,
      );

      expect(wrapper.find(`.${styles.projectOwner}`)).to.have.lengthOf(1);
    });
  });
  context('when the current user is an admin and the user in the popover is not', () => {
    beforeEach(() => {
      this.props = {
        user: { id: 2, login: 'glitchWitch', name: 'Glinda the Witch' },
        project: {
          permissions: [
            {
              userId: 1,
              accessLevel: 30,
            },
          ],
        },
        reassignAdmin: sinon.spy(),
      };
      this.wrapper = mount(
        <MockContext currentUser={{ id: 1 }} location={'~projectPage'}>
          <PermissionsPopover {...this.props} />
        </MockContext>,
      );
    });

    it('renders a button to make the user in the popover the admin', () => {
      expect(this.wrapper.find(Button)).to.have.lengthOf(1);
    });

    context('and when the logged in user clicks that button', () => {
      it('calls reassign admin', () => {
        this.wrapper.find(Button).simulate('click');
        expect(this.props.reassignAdmin.called);
      });
    });
  });
});
