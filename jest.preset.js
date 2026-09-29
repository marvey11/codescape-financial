const { readFileSync } = require("fs");
const path = require("path");
const nxPreset = require("@nx/jest/preset").default;

const rootSwcConfig = JSON.parse(
  readFileSync(path.join(__dirname, ".spec.swcrc"), "utf-8"),
);
rootSwcConfig.swcrc = false;

module.exports = {
  ...nxPreset,
  transform: {
    "^.+\\.[tj]s$": ["@swc/jest", rootSwcConfig],
  },
  // Allow @nestjs packages (and rxJS/tslib if used) to be transformed by SWC
  transformIgnorePatterns: ["/node_modules/(?!(@nestjs|rxjs|.*\\.mjs$))"],
};
