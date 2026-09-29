# AGENTS.md

## Repository overview

This repository is a TypeScript/React monorepo for Codescape Financial. The workspace uses Nx and ESLint flat config.

## Working conventions

- Prefer focused, minimal changes that match the current code patterns.
- Keep flat ESLint config compatible with ESLint v9+/v10 and Nx 23.x.
- Ignore generated output such as `dist`, `out-tsc`, `.nx`, and vendored dependency paths in lint config.
- If a library or app uses React-specific linting, scope it to real JSX/TSX sources only.
- Keep config changes in sync across the monorepo when the root config is updated.

## Validation

Before considering work complete, run the relevant verification command using Yarn, such as:
- `npx nx run-many -t lint --skip-nx-cache`

If a narrower command is enough for the change, prefer the smallest relevant validation.
