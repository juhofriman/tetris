const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});


module.exports = (env) => {
  return {
      entry: {
        main: './src/main.ts'
      },
      module: {
          rules: [
            {
              test: /\.tsx?$/,
              use: 'ts-loader',
              exclude: /node_modules/
            }
          ]
      },
      resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
      },
      plugins: [
          htmlPlugin
      ]
  }
};
