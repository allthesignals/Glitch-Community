// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

require('@percy/cypress');

const omitBy = require('lodash/omitBy');
const keys = require('lodash/keys');
const isObject = require('lodash/isObject');
const isArray = require('lodash/isArray');
const { fakePersistentToken } = require('./data.js');

const filterTokens = (value) => {
  if (isArray(value)) {
    value = value.map(filterTokens);
  } else if (isObject(value)) {
    keys(value).map((key) => {
      value[key] = filterTokens(value[key]);
    });
    value = omitBy(value, (_, key) => key.match('\\w+Token|password|email'));
  }
  return value;
};

Cypress.Commands.add('createFixture', (name, url) =>
  cy
    .request({ url, headers: { Authorization: Cypress.env('GLITCH_TOKEN') } })
    .then((response) => cy.writeFile(`cypress/fixtures/${name}.json`, filterTokens(response.body))),
);

Cypress.Commands.add('createFixtures', (fixtures) => Object.entries(fixtures).forEach((entry) => cy.createFixture(entry[0], entry[1])));

Cypress.Commands.add('signIn', () => {
  const cachedUser = {
    persistentToken: fakePersistentToken,
  };
  window.localStorage.setItem('cachedUser', JSON.stringify(cachedUser));
});

Cypress.Commands.add('enableDevToggles', (devToggles) => {
  window.localStorage.setItem('community-userPrefs', JSON.stringify({ devToggles }));
});

// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
