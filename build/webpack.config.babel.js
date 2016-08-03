import CopyWebpackPlugin from 'copy-webpack-plugin';
import webpack from 'webpack'

export default {
  context: __dirname + '/../src',
  target: 'node',
  entry: {
    app: ['babel-polyfill', './index.js']
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/../dist'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ],
    noParse: /node_modules\/json-schema\/lib\/validate\.js/
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'cookie.json' }
    ])
  ]
}