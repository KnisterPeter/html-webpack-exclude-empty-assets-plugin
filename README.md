> HtmlWebpackExcludeEmptyAssetsPlugin

This will prevent the HtmlWebpackPlugin from adding empty assets into the html.

# Usage

```js
const HtmlWebpackExcludeEmptyAssetsPlugin = require('html-webpack-exclude-empty-assets-plugin');

module.exports = {
  // ...
  plugins: [
    // ...
    new HtmlWebpackPlugin(),
    new HtmlWebpackExcludeEmptyAssetsPlugin(),
    // ...
  ]
};
```

## All Configuration Options

The HtmlWebpackExcludeEmptyAssetsPlugin accepts an object of options with the following attributes:

```js
new HtmlWebpackExcludeEmptyAssetsPlugin({,
  minBytes: 1024
})
```

* `minBytes` - the minimum byte size a file has to meet to not be deleted. Defaults to 1024 bytes.
