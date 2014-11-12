var webpack = require('webpack');

var genFilename = function(isMin) {
  return [
    './dist/nuclear',
    (isMin ? '.min' : ''),
    '.js'
  ].join('');
}

var uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin();

module.exports = [
  {
    entry: './test.js',
    output: {
      library: 'mixintest',
      libraryTarget: 'umd',
      filename: './example/test.js'
    },
    module: {
      loaders: [
        { test: /\.js$/, loader: 'jstransform-loader' }
      ]
    },
  }
];
