const { resolve } = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(common, {
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: resolve('./public/'),
          to: resolve('./dist/'),
          globOptions: {
            ignore: ['**/*.html'],
          },
        }
      ]
    }),
    new OptimizeCssAssetsPlugin(),
    new webpack.ids.HashedModuleIdsPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
    moduleIds: 'deterministic',
  },
})
