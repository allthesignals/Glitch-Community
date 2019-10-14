# Style Guide (Draft)

This is our coding style guide.  It's a draft.  It will _always be a draft_, because style guides on live codebases are never done.  For the moment, this is our best set of captured guidance on coding styles for this site. If ever that doesn't seem true, it's time to edit more!

**How to understand this guide**:

This guide doesn't (and cannot) stand on its own, it instead encourages you to find and use the best programming practices and idioms you know.  When there's meaningful choice or fork in direction, we try to set that here.  For more details on any of the practices in this guide, talk the topic through with one of the maintainers.  At present those people are: Jude, Greg, Pirijan

We're not strict about enforcing the "latest styles" on any new code, we merely ask that new code heads in the right direction.  That direction being...


### Components

We're in the process of moving our React architecture towards an Atomic Design-inspired approach, using CSS Modules as the backbone of that to better manage our styles across the app. All components live in src/components, and anything in there should be packaged as a CSS Module as follows:
```
+-- button/
|   +-- index.js
|   +-- styles.styl
```

Webpack builds the `src/components` directory as CSS Modules, and treats the `styles/` directory as traditional CSS/Stylus styles.

To add a new component, or convert an existing piece of our code into a CSS Module-enabled component, here's what you should do:
1. Create a new folder in `src/components/`. Use your best judgement for how it should be organized.
    * Only export one component per `.js` file. The component you're exporting should have the same name as the folder it's contained in (e.g. `TextArea` is exported from `text-area/` via `index.js` and styles should be in `styles.styl`). 
    * Classnames should be camelcased to make them easier to refer to in Javascript (e.g. `markdownContent` not `markdown-content`).
1. In general don't add margins, absolute positioning or fixed width/heights into the component - leave that to the parent components.
2. Where possible, we'd like to avoid passing styles into the components via props and instead rely on named props that cover the use cases of the different modes of the component (e.g. `Button` accepts a `type` prop like `"tertiary"` or `"dangerZone"`) that can be passed into the component. The named props then define the styles that apply - the classnames npm package can be used to combine these in more readable ways (see [Button.js](https://glitch.com/edit/#!/community?path=src/components/buttons/button.js:15:0) for an example)
  * Sometimes you'll need additional styles from parent components. Here's the preferred order of options to use here - ideally use the first one that works for your use case:
    1. Use a wrapper class and define the styles you need on that wrapper. If you'll use this same set of overrides in multiple places, it could make sense to pull this out as a separate component of its own.
      * This works in situations where you need to add positioning or margins to a component
    2. Add a new named prop to the component that fits your use case.
      * You'll need to do this if the internals of the component itself needs to look different in certain cases (e.g. font or colors) - editable Markdown would be a good example of this.
    3. Pass in className.
      * This makes sense in situations where there are lots of different styling needs that don't correspond to a particular mode that can be defined on the component - eg. <Image> currently allows a className prop.
    4. Directly style the HTML tag names like button or p
      * This is discouraged, but can be used if none of the above options make sense (e.g. if you need to override global styles that haven't been componentized yet).
3. Create stories for each relevant variant of the component in `stories/index.js`.
  * As well as providing a visual guide for all the building blocks of our site, our designers use this for visual QA.
  * Once this file gets too big, we'll likely start splitting it out, but for now all stories should go in there. 
4. Generate the new storybook guide on your remix as explained in the Storybook section below.

Some notes for the migration stage of this process:
1. At this point, our highest priority is getting styles out of styles/ and into the src/ folder with their respective presenters. If you only have time to do that and not to componentize it properly, please do! Keep these somewhere in the src/presenters folder for now until the true componentization has happened.
2. In some cases, your component might be using other elements that aren't properly componentized yet. The important part is to ensure that layout for your component still looks good, and then once it's using the future subcomponents, it can be re-QAed for those updates.
3. We still need Storybook stories for anything in the src/components folder, but the expectation is that they won't look identical to how they look on the website (see above point)

### Storybook

We now have [Storybook for React](https://www.npmjs.com/package/@storybook/react) integrated with our site, as we're gradually moving it towards a more component-based design. It's not hooked into the build process, so to see your changes reflected in it, you can do the following:
1. Run `npm run storybook` from the terminal console to build the static storybook files.
2. Go to `https://<remix-name>/storybook`. All the files are served there (from the build folder in the app).

### Make use of the absolute path aliases

We have aliases available on the server and client side, defined in the [shared aliases file](https://glitch.com/edit/#!/community?path=aliases.js). You can make use of those to remove the need for relative path imports. 

### Prefer Dependency Injection

All modules receive their dependencies as arguments to their constructor.  This is most especially true for any modules that we write, but we make exceptions for react components and stateless NPM modules.

Most importantly we should avoid passing state into a module by having that module import from a different, stateful module.

(e.g., if something wants access to the API, we should pass the API instance into it, not import the api from a global api session.)

### Make the Most of ES6

We're using it, and it's sweet!  Enjoy destructuring, ES6 classes, import/export, string literals, etc. 

Here's a nice guide to [What's New in ES6](http://es6-features.org/#Constants)

### Love your Linter

ESLint is running and outputting to 'logs'.  The linter is configured by `src/.eslintrc.js` and `server/.eslintrc.server.js`.

We're also using Prettier in addition to ESLint now. Some work has been done to make our Prettier and ESLint rules match. Running `./sh/prettify` will format the files in `/src` and `/server` for you.

To format the active file in the Glitch editor you can also use Glitch Prettier for your browser.

- [Glitch Prettier Extension for Chrome](https://glitch-prettier-extension.glitch.me/)
- [Glitch Prettier Plugin for Firefox](https://github.com/potch/glitch-prettier)

### Write A11Y-Compliant Html

Our linter runs a lovely jsx-a11y plugin which does a lot of the hard work for us.  It's still on us however to respect the spirit of the linter;  it's not enough to just pass, but we also want to be conscientious about using [quality alt-tags](https://a11yproject.com/posts/alt-text/), making sure you can accomplish all UI interactions via the keyboard (which often comes down to picking the right DOM elements), etc. 

More details available at [The A11y Project](https://a11yproject.com/)

### Prefer Common React Patterns

[React Patterns](https://reactpatterns.com/) is a great guide.  For the most part, our React code can all be written using the [stateless function pattern](https://reactpatterns.com/#stateless-function).  When we need state, we can use the [container component pattern](https://reactpatterns.com/#container-component).  It's rare that we need to build something that can't be factored out into those patterns.

### Avoid Components That Think Too Hard

Think about React components like you do functions.  If the component is getting too complicated, it probably needs to be decomposed.

### Use React Prop-Types

Our rule for [prop types](https://www.npmjs.com/package/prop-types) use is this:

 - Any React Component that's not a stateless function should declare all of its parameters as prop types. This is done primarily as a form of documentation for the input parameters to the component.
 
 - Any Stateless Function should define prop-types for any props _which it itself uses_, but not for any props which it merely passes directly through to sub-components.  In this manner we achieve prop-types composition across our stateless functions and maintain prop-types coverage without redundancy.

### Server Side Rendering

We use React's static renderer, which means that code in the `src/` folder is run both in the browser and in Node.

- Components which pull values off of the global window object in their render function should use `src/utils/constants.js` or `src/state/globals.js`, which differentiate between the browser and the server.

- If the initial render uses the current time or random values, it'll get different results on the client and server and fail to render. Read the time or randomize in an effect which will only run on the client.

### More

More to say? Add to this file.  Let's keep it to high level guidance and things that often need repeating.  Anything can be enforced by our linter instead of this doc deserves to be in the linter instead of this doc.