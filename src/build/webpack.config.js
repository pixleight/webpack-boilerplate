const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

const CleanPlugin = require('clean-webpack-plugin');
const CopyGlobsPlugin = require('copy-globs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('./config');

const assetsFilenames = (config.enabled.cacheBusting) ? config.cacheBusting : '[name]';

let webpackConfig = {
  entry: config.entry,
  devtool: (config.enabled.sourceMaps ? '#source-map': undefined),
  output: {
    path: config.paths.dist, // Folder to store generated bundle
    publicPath: config.publicPath,
    filename: `scripts/${assetsFilenames}.js`,  // Name of generated bundle after build
  },
  module: {  // where we defined file patterns and their loaders
    rules: [
      {
        test: /\.js$/,
        use: [
          { loader: 'cache-loader' },
          {
            loader: 'buble-loader',
            options: {
              objectAssign: 'Object.assign',
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'cache-loader' },
            {
              loader: 'css-loader',
              options: {
                sourceMap: config.enabled.sourceMaps,
              },
            },
            {
              loader: 'postcss-loader', options: {
                config: {
                  path: __dirname,
                  ctx: config,
                },
                sourceMap: config.enabled.sourceMaps,
              },
            },
          ],
        }),
      },
      {
        test: /\.(s[ca]ss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'cache-loader' },
            {
              loader: 'css-loader',
              options: { sourceMap: config.enabled.sourceMaps },
            },
            {
              loader: 'postcss-loader', options: {
                config: {
                  path: __dirname,
                  ctx: config,
                },
                sourceMap: config.enabled.sourceMaps,
              },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: config.enabled.sourceMaps },
            },
          ],
        }),
      },
    ],
  },
  devServer: {
    contentBase: config.paths.root,
    port: config.devPort,
    open: config.open,
  },
  plugins: [  // Array of plugins to apply to build chunk
    new CleanPlugin(config.paths.dist, {
      root: config.paths.root,
      verbose: false,
    }),
    new CopyGlobsPlugin({
      pattern: config.copy,
      output: `[path]${assetsFilenames}.[ext]`,
      manifest: config.manifest,
    }),
    new ExtractTextPlugin({
      filename: `styles/${assetsFilenames}.css`,
      allChunks: true,
      disable: (config.enabled.watcher),
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: config.enabled.optimize,
      debug: config.enabled.watcher,
      stats: { colors: true },
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.s?[ca]ss$/,
      options: {
        output: { path: config.paths.dist },
        context: config.paths.assets,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.js$/,
      options: {
        eslint: { failOnWarning: false, failOnError: true },
      },
    }),
    new HtmlWebpackPlugin({
      template: `${config.paths.assets}/index.html`,
    }),
    new FriendlyErrorsWebpackPlugin(),
  ],
};

if (config.enabled.cacheBusting) {
  const WebpackAssetsManifest = require('webpack-assets-manifest');

  webpackConfig.plugins.push(
    new WebpackAssetsManifest({
      output: 'assets.json',
      space: 2,
      writeToDisk: false,
      assets: config.manifest,
      replacer: require('./util/assetManifestsFormatter')
    })
  );
}

module.exports = webpackConfig;
