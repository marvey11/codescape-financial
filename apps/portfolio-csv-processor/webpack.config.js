const { join } = require("path");
const { createNodeWebpackConfig } = require(
  join(process.cwd(), "webpack.base.config"),
);

module.exports = createNodeWebpackConfig(__dirname);
