# Testing

This document is about how to use our testing tools as a part of your development workflow. For best results, run tests on your local machine.

## React Component/Redux Tests

We use mochapack for React Component and Redux tests. Mochapack is built on mocha, with the added benefit of running webpack on our test files and then runs pipes the output of webpack to mocha. See the options we send to mochapack in `mochapack.opts` in the project directory.

### Writing Tests

- Add your tests inside test/ComponentName/index.test.js

### Running Tests

- Don't forget to `npm install` if any dependencies have changed since you last ran the app or tests.

- To run tests: `npm run test`

### Debugging Tests in VS Code:

1.  Add the following to launch.json

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
