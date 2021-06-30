const { resolve } = require('path')

const sveltePreprocess = require('svelte-preprocess')
const svgToMiniDataURI = require('mini-svg-data-uri')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const devMode = (process.env.NODE_ENV === 'development')
const transpileDependencies = [
  'svelte',
]

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: devMode ? 'eval-cheap-module-source-map' : 'source-map',
  entry: './src/main.js',
  output: {
    publicPath: devMode ? '/' : '/dist/',
    filename: devMode ? 'js/[name].js' : 'js/[name].[contenthash:8].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: devMode ? /node_modules/ : new RegExp(`node_modules/(?!(${transpileDependencies.join('|')})/).*`),
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
              hotReload: devMode,
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
        include: [resolve('./src/')],
        exclude: /svelte\.\d+\.css/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        include: [/svelte\.\d+\.css/, resolve('./src/')],
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
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              outputPath: 'img',
              name: devMode ? '[name].[ext]' : '[name].[contenthash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              generator: (content) => svgToMiniDataURI(content.toString()),
              outputPath: 'img',
              name: devMode ? '[name].[ext]' : '[name].[contenthash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|ttf|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'fonts',
          name: devMode ? '[name].[ext]' : '[name].[contenthash:8].[ext]',
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: devMode ? 'css/[name].css' : 'css/[name].[contenthash:8].css',
      chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[contenthash:8].css',
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
}
