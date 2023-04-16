
# Changelog

- v3.0
  - Upgrade `case-match` to use modern Node.js 14+ features.
  - Convert package to ES modules by default using `module: "type"`.
  - Use `exports` in `package.json` rather than `main`. This is technically a breaking change due to the change
    in which subpaths can be imported.
  - Drop support for Node 12.
  - Upgrade to package-lock v2 format.

- v2.2
  - Drop support for Node v10 + IE 11

- v2.1
  - Drop support for Node v8

- v2.0
  - [breaking] Removed support for predicate lists.
  - Added TypeScript support.
  - Removed dependency on lodash.
  - Removed core-js polyfills to cut down on library size (if a polyfill is needed, include it in the application).

- v1.0
  - Initial version.
