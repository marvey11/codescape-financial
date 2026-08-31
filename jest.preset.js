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
  transformIgnorePatterns: ["/node_modules/(?!(@nestjs/config|.*\\.mjs$))"],
};
