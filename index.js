const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require('html-webpack-plugin');

class HtmlWebpackExcludeEmptyAssetsPlugin {

  constructor(options = {}) {
    this.minBytes = options.minBytes || 1024; // 1 KB minimum size
    this.PLUGIN = "HtmlWebpackExcludeEmptyAssetsPlugin";
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(this.PLUGIN, (compilation) => {
      if(compilation.hooks) {
        // webpack 4.x and later
        if(compilation.hooks['htmlWebpackPluginAlterAssetTags']) {
          compilation.hooks['htmlWebpackPluginAlterAssetTags'].tapAsync(this.PLUGIN, (htmlPluginData) => {
            const result = this.processAssets(htmlPluginData, compilation);
            return Promise.resolve(result);
          });
        } else {
          // HtmlWebpackPlugin 4.x and later
          const hooks = HtmlWebpackPlugin.getHooks(compilation);
          hooks["alterAssetTags"].tapAsync(this.PLUGIN, (htmlPluginData) => {
            const result = this.processAssets(htmlPluginData, compilation);
            return Promise.resolve(result);
          });
        }
      } else {
        // webpack 3.x and earlier
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
      }
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

    if(compilation.hooks) {
      // webpack 4.x and later
      var scripts = pluginData.assetTags.scripts.filter(filterTag);
      var styles = pluginData.assetTags.styles.filter(filterTag);
      return Promise.resolve({
        assetTags: {
          scripts: scripts,
          styles: styles,
          meta: pluginData.assetTags.meta,
        },
        outputName: pluginData.outputName,
        plugin: pluginData.plugin,
      });
    } else {
      // webpack 3.x and earlier
      return {
        head: pluginData.head.filter(filterTag),
        body: pluginData.body.filter(filterTag),
        plugin: pluginData.plugin,
        chunks: pluginData.chunks,
        outputName: pluginData.outputName,
      };
    }
  }

  isEmpty(assetPath, base, compilation) {
    const rel = assetPath.substr(base.length);
    const source = compilation.assets[rel];
    if (source && source.size) {
      return source.size() === 0 || source.size() < this.minBytes;
    }
    return false;
  }
}

module.exports = HtmlWebpackExcludeEmptyAssetsPlugin;
