# Frontend applications

All applications will use React and TypeScript. Start with the shell and Issues UI; add Module Federation in phase 2.

Each application has `public/`, `src/`, and `tests/`. Domain UI lives in `src/features/`, route screens in `src/pages/`, and API clients in `src/api/`. Shared UI belongs in `packages/ui`.

The shell additionally owns `src/auth/`, `src/layouts/`, `src/routes/`, and `src/remotes/` for authentication integration, navigation, and remote loading with failure boundaries.

Application-specific manifests, federation configuration, and Dockerfiles will be added during implementation so each application can build and deploy independently.
