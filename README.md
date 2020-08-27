# Frontend webapp

This frontend webapp is developed using React - Redux - Redux Saga - NextJS - Type Script - Github Primer CSS - BlueprintJS

## Main technical points

- React: <https://reactjs.org/>
- NextJS: <https://nextjs.org/docs>, <https://nextjs.org/learn/basics/getting-started>
- Redux: <https://medium.freecodecamp.org/understanding-redux-the-worlds-easiest-guide-to-beginning-redux-c695f45546f6>
- Redux-Saga: <https://medium.com/@resir014/redux-4-typescript-2-9-a-type-safe-approach-7f073917b803>
- Typescript: <https://medium.com/@resir014/redux-4-typescript-2-9-a-type-safe-approach-7f073917b803>
- Github Primer CSS: <https://primer.style/css/>
- BlueprintJS: <https://blueprintjs.com/docs/>
- SCSS structure: <https://itnext.io/structuring-your-sass-projects-c8d41fa55ed4>
- SCSS Standard: <https://primer.style/css/principles/scss>

## Quick start

### Install tools and libraries

- Run `yarn install` to install all dependencies in `package.json` file

### Generate typescript models from graphql by module
- With auth module run: `yarn run graphql-codegen-auth`
  
### Run frontend

- Run with dev mode: run `yarn next_dev`
- Run with prod mode: run `yarn next_build` and `yarn next_start`

## Architect

Project directory:

- src/components: contains standalone components (not connect to redux)
- src/layout: contains layout component (connect to redux)
- src/pages: contains page component (connect to redux)
- src/store: redux store
- src/utils: utility
- src/scss: contains all components, pages, variables style
    + src/scss/abstracts: contains common variables, functions, mixins
    + src/scss/components: contains all component styles (ex button, grid, form, dialog...)
    + src/scss/pages: contains specific styles for each page need specific page
    + src/scss/themes: contains variables, images and specific styles for each theme
    + src/scss/layout: contains styles for layout components (ex header, footer, container...)
    + src/scss/vendors: contains all third party styles
    + src/scss/main.scss: import all scss files.

### Coding standard
- Rule number 1: Please observe the coding style and code template carefully and try to keep code as clean as possible, don't make your own style unless has been approved.
- Rule number 2: Write comments as the format tool suggest, don't leave warning on any file.
- Rule number 3: Keep your code GIT friendly by not writing a very long line of code, try to use line break.

### SCSS THEME 
``` 
    How to create theme style use scss
    Write all components, pages theme style in body element

    @mixin themable($theme-name, $theme-map) {
        body#{$theme-name} {
            .class {
                background-color: map-get($theme-map, primary-color) !important; //primary-color is key in theme variable
                ...
            }
        }
    }

    @include themable('', $light-variable);
    @include themable('.bp3-dark', $dark-variable);

```

## DOCKER
- `docker build -t webapp_next .`