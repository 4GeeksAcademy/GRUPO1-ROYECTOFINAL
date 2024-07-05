const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/front/js/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif|jpeg|webp)$/,
        use: {
          loader: 'file-loader',
          options: { name: '[name].[ext]' }
        }
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)$/,
        use: ['file-loader']
      },
      {
        test: /\.(mp4|webm|ogg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'videos/'
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: '4geeks.ico',
      template: 'template.html'
    })
  ]
};
