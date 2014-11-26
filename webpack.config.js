var webpack = require('webpack');

var genFilename = function(isMin) {
  return [
    './dist/nuclear-vue-mixin',
    (isMin ? '.min' : ''),
    '.js'
  ].join('');
}

var uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin();

console.log(process.cwd())

module.exports = [
  {
    entry: './example/test.js',
    output: {
      library: 'mixintest',
      libraryTarget: 'umd',
      filename: './example/dist/test.js'
    },
    module: {
      loaders: [
        { test: /\.js$/, loader: 'jstransform-loader' }
      ]
    },
  },
  {
    entry: './src/mixin.js',
    output: {
      library: 'NuclearVueMixin',
      libraryTarget: 'umd',
      filename: genFilename(false),
    },
    module: {
      loaders: [
        { test: /\.js$/, loader: 'jstransform-loader' }
      ]
    },
  },
  {
    entry: './src/mixin.js',
    output: {
      library: 'NuclearVueMixin',
      libraryTarget: 'umd',
      filename: genFilename(true),
    },
    module: {
      loaders: [
        { test: /\.js$/, loader: 'jstransform-loader' }
      ]
    },
    plugins: [uglifyJsPlugin],
  }
];
