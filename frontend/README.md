# Frontend (Angular)

## Requisitos

- Node 20+
- Dependências: `npm install` (gera/atualiza `package-lock.json` para CI)

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm start` | Servidor de desenvolvimento (`ng serve`) |
| `npm run build` | Build de produção |
| `npm test` | Jest com cobertura (`--coverage`) |
| `npm run test:watch` | Jest em modo watch |

## Testes e cobertura

- **Jest** + **jest-preset-angular** + ambiente Zone (`setupZoneTestEnv` em `setup-jest.ts`).
- Cobertura sobre `src/**/*.ts`, exceto `*.spec.ts` e **`src/main.ts`** (bootstrap), conforme `jest.config.js`.
- Meta global: **100%** em statements, branches, functions e lines.
- Relatório HTML: `coverage/lcov-report/index.html`.

## TypeScript

- `tsconfig.json`: base estrita (ES2022, `moduleResolution: bundler`).
- `tsconfig.app.json`: aplicação em `src/**` (exclui `*.spec.ts`).
- `tsconfig.spec.json`: testes + `setup-jest.ts`.

## API backend

A URL base versionada (`http://localhost:8080/api/v1`) está em `src/environments/environment.ts` (`apiBaseUrl`). Os serviços HTTP montam o path do recurso a partir desse valor.

## Docker

Na raiz do monorepo, o serviço `frontend` do `docker-compose` usa esta pasta como contexto (`./frontend`).
