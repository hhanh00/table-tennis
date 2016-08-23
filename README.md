# A refactor of the Table Tennis editor by `graNite`

I didn't do any of the main coding and all credits for it should go to him. My purpose was
simply to illustrate some of the refactoring capabilities that Javascript has.

- Original is using global scope for variables and functions which made understanding the 
data model difficult. `Editor` is in charge of maintaining `Table`s. `Drawing` is a static
class helping drawing arrows and stuff. `ImageResource` is a collection of pre drawn widgets.
`Mouse` is taking care of mouse events. This is the biggest refactor and it involved paying attention
to the meaning of `this` in different contexts. 
- Source is split into sub modules
- Move to webpack, node js for serving

# Build/Run

```
npm install
node app.js
```
