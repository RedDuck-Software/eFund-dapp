module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          "vue-style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              indentedSyntax: true,
              // sass-loader version >= 8
              sassOptions: {
                indentedSyntax: true,
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: "vue-svg-loader", // `vue-svg` for webpack 1.x
      },
    ],
  },
};
