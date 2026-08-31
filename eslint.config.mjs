import nx from "@nx/eslint-plugin";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],
  {
    // The plugin itself needs to be registered
    plugins: {
      "react-hooks": reactHooksPlugin,
    },
    // The rules are under the 'rules' key
    rules: {
      // These are the two main rules.
      // 'error' for rules-of-hooks is critical.
      // 'warn' for exhaustive-deps is common, but 'error' is for stricter projects.
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
    // You might need to specify files if this config object shouldn't apply globally
    // files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
  },
  {
    ignores: [
      "**/dist",
      "**/jest.config.ts",
      "**/vite.config.*.timestamp*",
      "**/vitest.config.*.timestamp*",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: true,
          allow: [
            "^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$",
            ".*/webpack\\.base\\.config\\.js$",
          ],
          depConstraints: [
            {
              sourceTag: "*",
              onlyDependOnLibsWithTags: ["*"],
            },
          ],
        },
      ],
      "@nx/dependency-checks": [
        "error",
        {
          buildTargets: ["build"],
          checkMissingDependencies: true,
          checkObsoleteDependencies: true,
        },
      ],
    },
  },
  {
    files: [
      "**/*.ts",
      "**/*.tsx",
      "**/*.cts",
      "**/*.mts",
      "**/*.js",
      "**/*.jsx",
      "**/*.cjs",
      "**/*.mjs",
    ],
    // Override or add rules here
    rules: {},
  },
];
