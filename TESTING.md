# Testing

This document is about how to use our testing tools as a part of your development workflow. For best results, run tests on your local machine. 

## React Component/Redux Tests 
We use mochapack for React Component and Redux tests.  Mochapack is built on mocha, with the added benefit of running webpack on our test files and then runs pipes the output of webpack to mocha. See the options we send to mochapack in `mochapack.opts` in the project directory. 

### Writing Tests
 - Add your tests inside test/ComponentName/index.test.js

### Running Tests
 - Don't forget to `npm install` if any dependencies have changed since you last ran the app or tests. 

 - To run tests: `npm run test`

### Debugging Tests in VS Code: 
 1. Add the following to launch.json 
```
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Mochapack",
      "port": 9229
    }
```
2. Select 'Attach to Mochapack' in the dropdown in the debug window
![image](https://user-images.githubusercontent.com/4480480/66514285-70d32c80-eaa2-11e9-9c85-a2c63fc2a3df.png)
3. Set breakpoints in VS Code or add a `debugger` statement in the place you want to debug
4. Run `npm run test:debug:watch` in the command line
5. Press the 'continue' button in VS Code to skip pack the bin/mochapack file (apparently happens every time, there's no visible breakpoint and it's unclear why it stops here)

## Integration Tests with Cypress

### Initial Setup

You need to add a `GLITCH_TOKEN` to your local `.env`. You can get a test account's persistent token from Keybase (Files > team > fogcreek > community), or use your own.

Be careful using your account information here! Don't commit it.

You also probably need to run `npm install`.

### Running Tests

Wake up your remix (or the one you're testing) if it isn't active. The test runner will try to wait, but sometimes it doesn't always work.

To use `./sh/cypress.sh` give it a remix name `./sh/cypress.sh my-remix` or run tests against production with `./sh/cypress.sh community`.

### Writing Tests

Check out the [Cypress documentation for writing tests](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Writing-tests) before getting started.

Test files are in `cypress/integration` and organized by pages (`user_profile.js`). 

The one exception is `header_actions.js` which appear on every page, so are tested separately.

Tests will run against the production API unless you [stub a response for specific requests](https://docs.cypress.io/guides/guides/network-requests.html#Testing-Strategies).

Stubbed endpoints can return a [fixture](https://docs.cypress.io/guides/guides/network-requests.html#Fixtures) or a response you define.

You can write tests locally and sync the changes to your remix, or write tests on your remix and pull the changes before you run. You have to run tests locally though.


### Creating "Fixtures"

Fixtures are stored data that you can use to set up specific test scenarios. You can save a response from an API request and reuse it later or define your own.

Not all API requests need a fixture but some do need to be stubbed to avoid actually deleting a project, for example.

There are helpers that you can use to create fixtures as you're writing new tests. 

`cy.createFixture(name, url)` takes a name ("projectsByIds") and a URL (which will return the response you want to save) and saves it as `cypress/fixtures/${name}.json`

`cy.createFixtures(object)` takes an object where the keys are the fixture name, and the value is the URL to save and then maps that to `cy.createFixture`

You can use these in a `before` block in your tests to build up fixtures as you write the test and remove them once the fixtures are created.

Be careful not to commit a user fixture or something with sensitive data!

### Making your own test data

There are helpers in `cypress/support/data.js` for making objects that represent users, projects, collections, etc.

You can pass in an `options` object to override the default values of the returned objects.

### Workflow with Cypress

1. Remix and setup your local branch.
1. Start writing a test locally that describes the feature you're working on or bug you're fixing.
1. Run the tests against your remix while you work.
1. When the test passes and you're done working, make sure the remix changes and local test are both pushed to your PR.

--------------------

**Important notes**

1. Make sure not to accidentally commit anything in a fixture that you wouldn't want public!
1. We're running Cypress with `npx` in `./sh/cypress.sh` so it won't be in our `package.json`. 
    - Please do not put Cypress into the `package.json`. It is too big for a Glitch project (without tricks, and it still won't work after that).
    - Please do not run `./sh/cypress.sh` in your Glitch project. It is too big. It will not work.
    - Please run it locally if you are able.