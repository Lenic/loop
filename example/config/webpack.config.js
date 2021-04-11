const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function getPath(dir) {
  return path.join(process.cwd(), dir);
}

module.exports = {
  mode: 'development',
  devtool: false,
  entry: getPath('src/index.js'),
  output: {
    publicPath: '/',
    filename: 'js/[name].js',
    path: getPath('dist'),
    chunkFilename: 'js/chunks/[id].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.NamedChunksPlugin(),
    new HtmlWebpackPlugin({
      title: 'Once Demo',
      template: getPath('config/index.html'),
    }),
  ],
  devServer: {
    before: function (app) {
      app.get('/api/v1/users', function (req, res) {
        setTimeout(() => res.json([{ id: 3, name: '张三' }]), 2000);
      });
    },
  },
};
