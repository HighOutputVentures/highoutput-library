## Contribution guidelines
- use `nvm` to ensure that we use the same version of `NodeJS`
  - install the correct version of `NodeJS` by running `nvm install`
  - make the installed version the default version by running `nvm alias default <version>`
- use the local installation of `lerna`
  - run `lerna` commands throguh `npx`, e.g. `npx lerna bootstrap`
- use `lerna publish` to publish new versions of the packages
- use the [semver](https://semver.org/) guidelines to help you choose version numbers
- if you end up updating the versions of packages that you don't want to update, only update the patch version or the prerelease version
- a small group of people will be designated as `admins`
  - only the `admins` are given write access to the repository
  - only the `admins` can publish the packages
- contributors (non-`admins`) can fork the repository and create PRs