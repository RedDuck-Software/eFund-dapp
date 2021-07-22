/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/production-sub-path/" : "/",
  css: { requireModuleExtension: false },
  lintOnSave: process.env.NODE_ENV !== "production",
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.svg$/,
          loader: "vue-svg-loader",
        },
      ],
    },
  },

  chainWebpack: config => {
    config.module.rules.delete("svg");
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.hotReload = true;
        return options;
      });
  },
};
