# SmartOps AI — Local Startup Guide

One-time prerequisites: MySQL running locally with a `smartops_auth` DB (used by
`auth-service`), and MongoDB running locally (used by `alert-service`,
`insight-service`, `monitoring-service`). Docker only hosts Kafka here — DBs stay
as your existing local installs.

## 1. Start Kafka (Docker) — KRaft mode, no Zookeeper

```bash
docker compose up -d
```

This brings up:
- `kafka` — single-node broker+controller on `localhost:9092`
- `kafka-ui` — browser view of topics/messages at `http://localhost:8090` (handy
  for confirming messages are actually flowing, since `alert-service` publishes
  to `alerts-topic` while `insight-service` listens on `smartops-alerts` — those
  names don't match today, so insight-service won't receive anything until one
  side is renamed to match the other)

Check it's healthy:
```bash
docker compose ps
```
Wait for `kafka` to show `healthy` before starting the Spring Boot services —
they'll retry on their own if Kafka isn't ready yet, but a clean start avoids
noisy reconnect logs.

## 2. Start the backend (IntelliJ) — in this order

Spring Boot services register with Eureka and look each other up by name, so
`service-registry` has to be first and `api-gateway` has to be last.

1. **`service-registry`** (port 8761) — run it, wait for "Started
   ServiceRegistryApplication", then open `http://localhost:8761` to confirm.
2. **`auth-service`** (8081), **`monitoring-service`** (8082),
   **`alert-service`** (8084), **`insight-service`** (8086) — any order, can run
   in parallel. Each needs Kafka up; `auth-service` needs MySQL up;
   the other three need MongoDB up.
3. **`api-gateway`** (8080) — start last, once the services above show as
   `UP` on the Eureka dashboard.

Tip: in IntelliJ, select all 5 non-gateway run configurations and use
"Run Multiple" (or create a Compound run configuration named e.g.
`smartops-backend`) so step 2 is one click, then run `api-gateway` separately
right after.

## 3. Start the frontend (VS Code)

```bash
cd smartops-dashboard
npm install   # first time only
npm run dev
```

Runs at `http://localhost:3000` and talks to the gateway at `localhost:8080`
by default (see `lib/constants.ts` — override with `NEXT_PUBLIC_API_URL` /
`NEXT_PUBLIC_WS_URL` in a `.env.local` if you ever move ports).

## Shutting down

```bash
docker compose down          # stop Kafka + Kafka UI, keep topic data
docker compose down -v       # also wipe Kafka's stored data/offsets
```
