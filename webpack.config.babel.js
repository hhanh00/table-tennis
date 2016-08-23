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
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['strict', 'jshint'],
        // define an include so we check just the files we need
        include: __dirname,
        exclude: /node_modules/        
      }
    ],
    loaders: [{
      test: /\.jsx$/,
      loaders: ['babel-loader?presets=es2015'],
      exclude: path.resolve(__dirname, 'node_modules')
    },
    { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  devtool: 'eval'
};