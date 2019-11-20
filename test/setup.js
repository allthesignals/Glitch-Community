import jsdom from 'jsdom-global';

let cleanup;

before(() => {
  cleanup = jsdom({ url: 'https://glitch.com/' });
});

after(() => {
  cleanup();
});

function disableJsdom() {
  
}
