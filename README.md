# Webpack Boilerplate

A starter project to kick off development of Webpack-compiled websites.

## Features

* Sass stylesheet compiling
* Javascript ES6 transpiling
* Webpack Dev Server

## Requirements

* [Node.js](http://nodejs.org/) (developed on 8.5.0)
* [NPM](https://www.npmjs.com/) (developed on 5.4.2)

### Optional

* [Yarn](https://yarnpkg.com/en/docs/install) (developed on 1.0.2)

## Installation

Installation and usage assume `yarn` is installed.

If not, substitute `npm`.

```shell
$ yarn install
```

## Configuration & Development

Project files can be found in `src/`.

Configuration can be found in `src/build/`.

It's not necessary to add tags to load local stylesheets or scripts in `index.html`, Webpack will generate those for you.

### Development Server

For a live reloading development server, run:

```shell
$ yarn serve
```

Files are served from `dist/` to http://localhost:8080

## Building project

```shell
$ yarn build
```

Generates files in `dist/`.

### Building for production

Minifies scripts and stylesheets for production use, and adds cache-busting hashes to filenames.

```shell
$ yarn build:production
```
