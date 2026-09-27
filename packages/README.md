# Shared packages

- `ui/src/components`, `ui/src/tokens`, `ui/src/styles`: reusable accessible UI and visual foundations.
- `auth/src`: OIDC integration, authentication state, and role-aware UI helpers. Backend authorization remains mandatory.
- `types/src/api`, `types/src/events`, `types/src/domain`: explicit API/event contracts and shared domain vocabulary. TypeScript types do not replace runtime validation.
- `utilities/src`: small framework-independent helpers.

Each package has a private manifest, an explicit ESM export, a TypeScript build configuration, and a `tests/` directory. The public `src/index.ts` entry points are empty until implementation. Run `pnpm build` before consuming their generated exports. Avoid imports into another package's private files.

The shared library configuration targets ES2022 with NodeNext resolution. Add browser libraries, JSX support, and React dependencies to UI/auth packages when they need them. React applications will extend the strict base with bundler-specific settings; NestJS services will choose their module/decorator settings during backend implementation.
