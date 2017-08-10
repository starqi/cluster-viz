const path = require('path'); 
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map', // Build bundle with source map included
  plugins: [
    new CleanWebpackPlugin(['dist']), // Empty dist folder on build
    new HtmlWebpackPlugin({ // Generate dist/index.html with title on build
      title: 'ClusterViz',
      filename: 'index.html'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery', // Global references
      jQuery: 'jquery'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }, 
      { 
        test: /\.(jpeg|png|gif|svg|ttf|eot|woff|woff2)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
};
