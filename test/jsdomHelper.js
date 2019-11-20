import jsdom from 'jsdom-global';

const url = 'https://glitch.com/';

let cleanup;

before(() => {
  cleanup = jsdom({ url });
});
after(() => {
  cleanup();
});

export function disableJsdom() {
  beforeEach(() => {
    cleanup();
  });
  afterEach(() => {
    cleanup = jsdom({ url });
  });
}