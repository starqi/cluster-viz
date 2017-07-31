const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      { test: /\.(jpeg|png|gif)$/,
        use: [
          'file-loader'
        ]
      },
      { test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};
