const path = require('path')

module.exports = {
  entry: './in/script/test.js',
  output: {
    path: path.join(__dirname, './out/static/script'),
    filename: 'test.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
