module.exports = {
  css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        prependData: `@import "@/sass/_vars.scss";`
      }
    }
  }
};
