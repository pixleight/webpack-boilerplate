const path = require('path');
const merge = require('webpack-merge');
const { argv } = require('yargs');

const rootPath = process.cwd();

const isProduction = !!((argv.env && argv.env.production) || argv.p);

const config = {
  entry: {
    main: [
      './src/scripts/main.js'
      ,'./src/styles/main.scss'
    ],
  },
  copy: 'images/**/*',
  open: true,
  devPort: 8181,
  cacheBusting: '[name]_[hash:8]',
  publicPath: '/',
  paths: {
    root: rootPath,
    dist: path.join(rootPath, 'dist'),
    assets: path.join(rootPath, 'src'),
  },
  enabled: {
    sourceMaps: !isProduction,
    optimize: isProduction,
    cacheBusting: isProduction,
    watcher: !!argv.watch,
  }
}

module.exports = merge(config, {
  env: Object.assign({
    production: isProduction,
    development: !isProduction,
  }, argv.env),
  manifest: {},
});

if (process.env.NODE_ENV === undefined) {
  process.env.NODE_ENV = isProduction ? 'production' : 'development';
}
