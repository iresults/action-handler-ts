# AGENTS.md

## Project

Small React 16 + TypeScript library (`action-handler`). Public entry points are `build/dist/index.js` and `build/dist/index.d.ts`; source lives in `src/`.

## Commands

- Install: `npm install`
- Tests: `npm test` (Vitest; runs `vitest run`)
- Tests (watch mode): `npm run test:watch`
- Single file/pattern: `npm test -- src/ActionHandler.test.tsx`
- Build: `npm run build` (`tsc -p tsconfig.build.json`)

## Gotchas

- Test tooling is now Vitest (`vite.config.mts`); Create React App/react-scripts, `src/react-app-env.d.ts`, and the `react-app` Babel/ESLint presets have been removed.
- `npm run build` output goes to `build/dist`; `build/` is gitignored.
- `tslint.json` references `tslint-react` and `tslint-config-prettier`, which are not in `devDependencies`; there is no lint script in `package.json`. Do not assume `npm run lint` exists.
- `tsconfig.build.json` additionally excludes `src/TestApp.tsx`; build is the authoritative typecheck path.

## Structure

- `src/ActionHandler.tsx` - `ActionHandler` implementation
- `src/ActionHandlerInterface.tsx` - `ActionHandlerInterface`
- `src/AppContainer.tsx` - renders the root component and registers it with the handler; accepts a handler class or instance
- `src/index.tsx` - barrel exports

## Testing

- Two test files: `src/ActionHandler.test.tsx` and `src/AppContainer.test.tsx` (6 tests total).
- `AppContainer.test.tsx` uses a shallow renderer, so `registerRoot` is not exercised there (see the commented-out test in that file).
- `jest-fetch-mock` is present but unused by current tests.

## Guidelines

- Never modify or create files above the projects root folder (the location of `package.json )
