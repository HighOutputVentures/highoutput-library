# Highoutput Library

This project is an initiative to create a central repository for all reusable code used across all projects in the highoutput company.

## Getting Started

The project uses lerna as the module manager, you can install dependencies, run tests, run lint, and publish packages using lerna.

```bash
# Install dependencies
$ lerna bootstrap

# Run lint
$ lerna run lint

# Run tests
$ lerna run test
```

## Contribution Guide

* The name of each module should be prefixed with `highoutput-`, e.g. `highoutput-utilities`
* All modules under this repository will be published into `npm` under the `highoutput` account

## Publishing Guide
