/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */

module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  publicPath: process.env.NODE_ENV === "production" ? "/production-sub-path/" : "/",
  css: { requireModuleExtension: false },
  lintOnSave: process.env.NODE_ENV !== "production",

  chainWebpack: config => {
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
