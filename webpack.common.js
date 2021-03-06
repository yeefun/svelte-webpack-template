const { resolve } = require('path');

const sveltePreprocess = require('svelte-preprocess');
const svgToMiniDataURI = require('mini-svg-data-uri');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const isDevEnv = process.env.NODE_ENV === 'development';
const transpileDependencies = ['svelte'];

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: isDevEnv ? 'eval-cheap-module-source-map' : 'source-map',
  entry: './src/main.js',
  output: {
    publicPath: isDevEnv ? '/' : '/dist/',
    filename: isDevEnv ? 'js/[name].js' : 'js/[name].[contenthash:8].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: isDevEnv
          ? /node_modules/
          : new RegExp(
              `node_modules/(?!(${transpileDependencies.join('|')})/).*`
            ),
        use: ['babel-loader'],
      },
      {
        test: /\.(html|svelte)$/,
        use: [
          'babel-loader',
          {
            loader: 'svelte-loader',
            options: {
              emitCss: true,
              hotReload: isDevEnv,
              preprocess: sveltePreprocess({
                scss: {
                  renderSync: true,
                },
                postcss: true,
              }),
            },
          },
        ],
        include: [resolve('./src/')],
      },
      {
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false, // necessary if you use url('/path/to/some/asset.png|jpg|gif')
            },
          },
        ],
      },
      {
        test: /\.(|png|jpe?g|gif)$/,
        dependency: { not: ['url'] },
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              outputPath: 'images',
              name: isDevEnv ? '[name].[ext]' : '[name].[contenthash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        type: 'asset/inline',
        generator: {
          dataUrl: (content) => svgToMiniDataURI(content.toString()),
        },
      },
      {
        test: /\.(woff|woff2|ttf|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: isDevEnv
            ? 'fonts/[name].[ext]'
            : 'fonts/[name].[contenthash:8].[ext]',
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isDevEnv ? 'css/[name].css' : 'css/[name].[contenthash:8].css',
      chunkFilename: isDevEnv ? 'css/[id].css' : 'css/[id].[contenthash:8].css',
    }),
    new HtmlWebpackPlugin({
      title: 'Svelte App',
      template: resolve('./public/index.html'),
      filename: 'index.html',
    }),
    new ESLintPlugin({
      extensions: ['js', 'svelte'],
      files: './src/',
    }),
  ],
  optimization: {
    runtimeChunk: 'single',
  },
  resolve: {
    alias: {
      svelte: resolve('./node_modules/svelte/'),
    },
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
};
