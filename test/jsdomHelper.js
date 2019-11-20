import jsdom from 'jsdom-global';

const url = 'https://glitch.com/';

let cleanup = jsdom({ url });
cleanup(); // immediately boot up because the first run takes a long time and times out tests

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