const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const client = path.resolve(__dirname, 'client');

module.exports = {
  entry: path.resolve(client, 'src', 'index.jsx'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(client, 'dist'),
  },
  mode: 'development',
  watch: true,
  module: {
    rules: [
      {
        test: /\.?jsx$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
            ],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.jsx', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(client, 'src', 'index.html'),
    }),
  ],
};
