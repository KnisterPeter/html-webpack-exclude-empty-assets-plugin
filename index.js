const path = require("path");
const fs = require("fs");

class HtmlWebpackExcludeEmptyAssetsPlugin {
  apply(compiler) {
    compiler.plugin("compilation", (compilation) => {
      compilation.plugin(
        "html-webpack-plugin-alter-asset-tags",
        (htmlPluginData, callback) => {
          const result = this.processAssets(htmlPluginData, compilation);
          if (callback) {
            callback(null, result);
          } else {
            return Promise.resolve(result);
          }
        }
      );
    });
  }

  processAssets(pluginData, compilation) {
    const base = JSON.parse(pluginData.plugin.assetJson)[0];
    const filterTag = (tag) =>
      !["link", "script"].includes(tag.tagName) ||
      !Boolean(tag.attributes) ||
      !this.isEmpty(
        tag.attributes.src || tag.attributes.href,
        base,
        compilation
      );

    return {
      head: pluginData.head.filter(filterTag),
      body: pluginData.body.filter(filterTag),
      plugin: pluginData.plugin,
      chunks: pluginData.chunks,
      outputName: pluginData.outputName,
    };
  }

  isEmpty(assetPath, base, compilation) {
    const rel = assetPath.substr(base.length);
    const source = compilation.assets[rel];
    if (source && source.size) {
      return source.size() === 0;
    }
    return false;
  }
}

module.exports = HtmlWebpackExcludeEmptyAssetsPlugin;
