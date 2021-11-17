const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

let htmlPageNames = ["games"];
let multipleHtmlPlugins = htmlPageNames.map((name) => {
  return new HtmlWebpackPlugin({
    template: `../src/${name}.html`,
    filename: `${name}.html`,
  });
});

module.exports = {
  entry: path.resolve(__dirname, "../src/script.js"),
  output: {
    filename: "bundle.[contenthash].js",
    path: path.resolve(__dirname, "../dist"),
  },
  devtool: "source-map",
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, "../static") }],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../src/index.html"),
      minify: true,
    }),
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, "../src/games.html"),
    //   filename: "games.html",
    // }),
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, "../src/navigation_three.html"),
    //   filename: "navigation_three.html",
    // }),
    new MiniCSSExtractPlugin(),
  ],
  module: {
    rules: [
      // HTML
      {
        test: /\.(html)$/,
        use: ["html-loader"],
      },

      // JS
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },

      // CSS
      {
        test: /\.css$/,
        use: [MiniCSSExtractPlugin.loader, "css-loader"],
      },

      // Images
      {
        test: /\.(jpg|png|gif|svg)$/,
        type: "asset/resource",
      },

      // GLTF Files
      {
        test: /\.(gltf|glb)$/,
        type: "gltf-webpack-loader",
      },

      // Fonts
      {
        test: /\.(ttf|eot|otf|wwoff|woff2)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets/fonts/",
            },
          },
        ],
      },
    ],
  },
};
