const { join } = require("path");
const { createNodeWebpackConfig } = require(
  join(__dirname, "../../webpack.base.config"),
);

module.exports = createNodeWebpackConfig(__dirname);
