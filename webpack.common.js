const { resolve } = require('path')

const sveltePreprocess = require('svelte-preprocess')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const devMode = (process.env.NODE_ENV === 'development')
const transpileDependencies = [
  'svelte'
]

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: devMode ? 'cheap-module-eval-source-map' : 'source-map',
  entry: './src/main.js',
  output: {
    path: resolve('./dist/'),
    filename: devMode ? './js/[name].js' : './js/[name].[contenthash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/i,
        exclude: devMode ? /node_modules/ : new RegExp(`node_modules/(?!(${transpileDependencies.join('|')})/).*`, 'i'),
        use: ['babel-loader']
      },
      {
        test: /\.(html|svelte)$/i,
        use: [
          'babel-loader',
          {
            loader: 'svelte-loader',
            options: {
              emitCss: !devMode,
              hotReload: devMode,
              preprocess: sveltePreprocess({
                scss: {
                  renderSync: true
                },
                postcss: true
              })
            }
          },
          {
            loader: 'eslint-loader',
            options: {
              emitWarning: devMode
            }
          }
        ],
        include: [resolve('./src/')]
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        include: [resolve('./src/')]
      },
      {
        enforce: 'pre',
        test: /\.js$/i,
        include: [resolve('./src/')],
        loader: 'eslint-loader'
      },
      {
        test: /\.(|png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: devMode ? '[path][name].[ext]' : '[path][name].[contenthash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|ttf|eot|ttf|otf)$/i,
        loader: 'file-loader',
        options: {
          name: devMode ? '[path][name].[ext]' : '[path][name].[contenthash:8].[ext]'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[contenthash:8].css',
      chunkFilename: devMode ? '[id].css' : '[id].[contenthash:8].css'
    }),
    new HtmlWebpackPlugin({
      title: 'Svelte App',
      template: resolve('./public/index.html'),
      filename: 'index.html'
    })
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        chunks: 'all',
        common: {
          name: 'common',
          chunks: 'initial',
          minChunks: 2,
          priority: 1
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'initial',
          priority: 2,
          enforce: true
        }
      }
    }
  },
  resolve: {
    alias: {
      svelte: resolve('./node_modules/svelte/')
    },
    mainFields: ['svelte', 'browser', 'module', 'main']
  }
}