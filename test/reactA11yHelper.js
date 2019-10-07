// Marcy Sutton https://gist.github.com/marcysutton/835c2fd90fadb631414b39523d5bda61
import React from 'react';
import { render } from 'react-dom';
import { mount } from 'enzyme';
import axeCore from 'axe-core';

export const a11yHelper = {};

/**
 * Test a component with React's Test Utils.
 *
 * @param {any} app - Your app reference.
 * @param {object} config (optional) - An aXe config object to enable/disable rules. See
 * [axe.a11yCheck](https://github.com/dequelabs/axe-core/blob/master/doc/API.md#options-parameter).
 * @param {function} callback - A callback function to execute when aXe returns.
 */
a11yHelper.testReactComponent = function(app, config, callback) {
  let div = document.createElement('div');
  document.body.appendChild(div);
  this.wrapper = render(app, div);

  let node = wrapper.getDOMNode();

  if (typeof config === 'function') {
    config = {};
  }
  this.run(node, config, callback);

  document.body.removeChild(div);
};
/**
 * Test a component with Enzyme.
 *
 * @param {any} app - Your app reference.
 * @param {object} config (optional) - An aXe config object to enable/disable rules. See
 * [axe.a11yCheck](https://github.com/dequelabs/axe-core/blob/master/doc/API.md#options-parameter).
 * @param {function} callback - A callback function to execute when aXe returns.
 */
a11yHelper.testEnzymeComponent = function(app, config, callback) {
  let div = document.createElement('div');
  document.body.appendChild(div);

  let wrapper = mount(app, { attachTo: div });
  let node = wrapper.getDOMNode();

  if (typeof config === 'function') {
    config = {};
  }
  this.run(node, config, callback);
  document.body.removeChild(div);
};
/**
 * Run an aXe audit.
 * @private
 *
 * @param {object} node - A node reference from your app.
 * @param {object} config - An aXe config or empty object.
 * @param {function} callback - A callback function to execute when aXe returns.
 */
a11yHelper.run = function(node, config, callback) {
  var oldNode = global.Node;
  global.Node = node.ownerDocument.defaultView.Node;

  axeCore.run(node, config, function(err, results) {
    global.Node = oldNode;

    if (err instanceof Error) {
      return err;
    }

    a11yHelper.report(results);

    // return to the test expectation
    callback(results);
  });
};
/**
 * Report results in a readable fashion.
 * @private

 * @param {object} results - The aXe [results object](https://github.com/dequelabs/axe-core/blob/master/doc/API.md#results-object).
 */
a11yHelper.report = function(results) {
  // output some useful information
  let failureNotice = '';
  if (results.violations.length > 0) {
    failureNotice += 'Accessibility violations:\n';
    results.violations.forEach(function(violation) {
      failureNotice += violation.description + '\n';
      failureNotice += 'HTML Nodes: \n';
      violation.nodes.forEach(function(node) {
        failureNotice += node.html + '\n';
      });
    });
    console.log(failureNotice);
  }
};
