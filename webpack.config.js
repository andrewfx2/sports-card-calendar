const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'sports-calendar.js',
    library: 'SportsCalendar',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      }
    ]
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
