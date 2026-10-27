const { NxAppWebpackPlugin } = require("@nx/webpack/app-plugin");
const { basename, join } = require("path");

/**
 * Generates standard Node application Webpack config.
 * @param {string} projectRoot - Absolute directory path of the sub-project (__dirname).
 */
function createNodeWebpackConfig(projectRoot) {
  return {
    output: {
      path: join(projectRoot, "../../dist/apps", basename(projectRoot)),
    },
    plugins: [
      new NxAppWebpackPlugin({
        target: "node",
        compiler: "tsc",
        main: "./src/main.ts",
        tsConfig: "./tsconfig.app.json",
        assets: ["./src/assets"],
        optimization: process.env.NODE_ENV === "production",
        extractLicenses: process.env.NODE_ENV === "production",
        outputHashing: "none",
        generatePackageJson: true,
      }),
    ],
  };
}

module.exports = { createNodeWebpackConfig };
