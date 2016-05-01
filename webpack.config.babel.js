import path from 'path';
import webpack from 'webpack';

export default {
  entry: [
    './index'
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  module: {
    loaders: [{
      test: /\.msx$/,
      loader: 'babel-loader?presets=es2015!msx-loader?es6module',
      exclude: path.resolve(__dirname, 'node_modules')
    },
    { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  },
  resolve: {
    extensions: ['', '.msx', '.js']
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  devtool: 'eval'
};