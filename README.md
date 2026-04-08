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

## Tela de benefícios

<img width="1417" height="904" alt="aba-beneficios" src="https://github.com/user-attachments/assets/23c1c4b2-3192-43a6-834c-c50c96714247" />

## Tela de transferências

<img width="1411" height="901" alt="aba-transferencias" src="https://github.com/user-attachments/assets/ad979549-6f84-4413-aba0-a3a9248576bf" />

## Tela de histórico

<img width="1418" height="904" alt="aba-historico" src="https://github.com/user-attachments/assets/2123d8dd-e1a0-43d4-8b02-2be3ce38e2a6" />

