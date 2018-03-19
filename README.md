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
