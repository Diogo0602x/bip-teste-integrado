# BIP — monorepo (backend + frontend)

API **Spring Boot** + UI **Angular** + **PostgreSQL** via Docker Compose.

| Pasta | Conteúdo |
|-------|----------|
| `backend/` | Spring Boot, API REST, testes e JaCoCo (`./mvnw`) |
| `frontend/` | Angular, testes Jest (`npm test`) |
| `docker-compose.yml` | Sobe Postgres, backend e frontend em dev |
| `backend/db/` | `schema.sql` e `seed.sql` (init do Postgres no primeiro `up`) |

---

## Início rápido (Docker)

Na raiz do repositório:

```bash
docker compose up --build
```

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| API REST (base) | http://localhost:8080/api/v1 |
| Documentação OpenAPI (Swagger UI) | http://localhost:8080/api/docs |
| Especificação OpenAPI (JSON) | http://localhost:8080/api/openapi |
| Postgres | `localhost:5433` — DB `bipdb`, user `bip`, senha `bip` |

---

## Desenvolvimento local (sem Docker)

**Backend** (`backend/`):

```bash
cd backend
./mvnw spring-boot:run
```

Testes + cobertura: `./mvnw verify` (JDK 17+; no Windows/Git Bash defina `JAVA_HOME` se precisar).

**Frontend** (`frontend/`):

```bash
cd frontend
npm install
npm start
```

Testes: `npm test` · Build: `npm run build`

---

## API (resumo)

Base REST: `http://localhost:8080/api/v1` — recursos em `/beneficios` (ex.: listagem em `GET /api/v1/beneficios`).

- `GET` listagem · `GET /{id}` · `POST` · `PUT /{id}` · `DELETE /{id}`
- `POST /transferencias` — corpo: `{ "fromId", "toId", "amount" }`

---

## CI

`.github/workflows/ci.yml`: testes Maven em `backend/` e `npm ci` + `npm test` + `npm run build` em `frontend/`.

---

## Mais informações

- `frontend/README.md` — Jest, cobertura e scripts npm.
