# 🐳 DevOps Training

A small Node.js REST API I use to practise the DevOps basics: **containerisation, docker-compose and CI/CD with GitHub Actions**.

## What's inside

| Area | What it shows |
| --- | --- |
| **App** | Express API with a health check and a tiny notes CRUD (`src/app.js`) |
| **Tests** | Integration tests with Node's built-in test runner, no extra dependencies (`test/`) |
| **Docker** | Multi-stage `Dockerfile`: production-only deps, non-root user, `HEALTHCHECK`, graceful shutdown on `SIGTERM` |
| **Compose** | `docker-compose.yml` for one-command local runs |
| **CI** | GitHub Actions: tests on Node 20 and 22, then builds the image and smoke-tests `/health` in a running container |

## API

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/health` | Status, uptime and version |
| `GET` | `/api/notes` | List notes |
| `POST` | `/api/notes` | Create a note: `{ "text": "..." }` |
| `DELETE` | `/api/notes/:id` | Delete a note |

## Run it

**With Node**

```bash
npm install
npm start          # http://localhost:3000
npm test
```

**With Docker**

```bash
docker build -t devops-training .
docker run -p 3000:3000 devops-training
```

**With docker-compose**

```bash
docker compose up --build
```

Then try it:

```bash
curl localhost:3000/health
curl -X POST localhost:3000/api/notes -H "Content-Type: application/json" -d '{"text":"Learn Docker"}'
curl localhost:3000/api/notes
```

## CI pipeline

```
push / PR ──► test (Node 20, 22) ──► docker build ──► run container ──► curl /health ✅
```

## Next steps I'm planning

- [ ] Push the image to GitHub Container Registry on tags
- [ ] Add a PostgreSQL service to docker-compose
- [ ] Deploy to a cloud provider with Terraform
- [ ] Add linting (ESLint) and test coverage to CI
