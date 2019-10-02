/// <reference types="Cypress" />

import { itemsResponse, keyByValueResponse } from '../support/util';
import { makeTestProject, makeTestUser, makeTestCollection } from '../support/data';

const anonPersistentToken = '444-444-444';
const anonId = 23;

describe('Homepage', () => {
  context('as anon user', () => {
    beforeEach(() => {
      cy.server({ force404: true });
      cy.route('POST', '**/users/anon', makeTestUser());

      cy.route('POST', '**/users/anon', makeTestUser({ persistentToken: anonPersistentToken, id: anonId })).as('anon-user');
      cy.route('GET', '**/v1/users/by/id/emails**', itemsResponse([])).as('emails');
      cy.route('GET', '**/v1/users/by/id**', keyByValueResponse([makeTestUser()], anonId)).as('anon-by-id');
      cy.route('GET', '**/v1/users/by/id/collections**', itemsResponse([]));
      cy.route('GET', '**/v1/users/by/id/projects**', itemsResponse([]));
      cy.route('GET', '**/v1/users/by/id/teams**', itemsResponse([]));
      cy.route('PATCH', 'users', {});

      cy.visit('/');
      cy.injectAxe();
    });

    it('loads the homepage', function() {
      cy.wait('@anon-user');
      cy.checkA11y();
    });
  });
});
