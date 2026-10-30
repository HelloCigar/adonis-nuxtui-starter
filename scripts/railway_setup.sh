#!/usr/bin/env bash
#
# One-time setup of a Railway project for this app, followed by a first deploy:
# creates the project, a PostgreSQL database and a "web" service, configures
# the service (Dockerfile build, migrations before each deploy, health check),
# sets its variables, deploys the current directory and generates a public URL.
#
# Usage:
#   npm run railway:setup             # empty app
#   npm run railway:setup -- --seed   # also seed the demo authors and posts
#
# Later deploys: `railway up --service web` (migrations run before each deploy).
#
set -euo pipefail

SERVICE="web"
SEED_DEMO_DATA="false"
if [[ "${1:-}" == "--seed" ]]; then
  SEED_DEMO_DATA="true"
fi

if ! command -v railway >/dev/null 2>&1; then
  echo "The Railway CLI is required, see https://docs.railway.com/cli for install options" >&2
  exit 1
fi

railway whoami >/dev/null 2>&1 || railway login

# @adonisplus/flow comes from the private AdonisJS Plus registry, so the image
# build needs its token. Read it from the environment, or from ~/.npmrc.
TOKEN="${ADONISPLUS_NPM_TOKEN:-}"
if [[ -z "$TOKEN" && -f "$HOME/.npmrc" ]]; then
  TOKEN="$(sed -n 's#^//plus.adonisjs.com/registry/:_authToken=##p' "$HOME/.npmrc" | tr -d '\r' | head -n 1)"
fi
if [[ -z "$TOKEN" ]]; then
  echo "Set ADONISPLUS_NPM_TOKEN to your AdonisJS Plus registry token." >&2
  exit 1
fi

APP_KEY="$(node ace generate:key --show --no-ansi | sed -n 's/^APP_KEY = //p')"

railway init --name adonis-nuxtui-starter
railway add --database postgres --json >/dev/null
railway add --service "$SERVICE" --json >/dev/null

SERVICE_ID="$(railway service list --json | node -e '
  let input = ""
  process.stdin.on("data", (chunk) => (input += chunk)).on("end", () => {
    const data = JSON.parse(input)
    const services = Array.isArray(data) ? data : data.services
    console.log(services.find((service) => service.name === process.argv[1]).id)
  })
' "$SERVICE")"

# Build and deploy settings. Railway no longer reads railway.json for new
# services, so they are set on the service itself.
node -e '
  const preDeployCommand =
    "sh -c '\''node ace migration:run --force && " +
    "if [ \"$SEED_DEMO_DATA\" = \"true\" ]; then node ace db:seed; fi'\''"

  console.log(JSON.stringify({
    services: {
      [process.argv[1]]: {
        build: { builder: "DOCKERFILE", dockerfilePath: "Dockerfile" },
        deploy: { preDeployCommand, healthcheckPath: "/login", restartPolicyType: "ON_FAILURE" },
      },
    },
  }))
' "$SERVICE_ID" | railway environment edit --json -m "Configure the web service"

# DB_* reference the variables of the Postgres service, resolved by Railway
railway variable set --service "$SERVICE" --skip-deploys \
  "NODE_ENV=production" \
  "HOST=0.0.0.0" \
  "PORT=3333" \
  "TZ=UTC" \
  "LOG_LEVEL=info" \
  "APP_KEY=$APP_KEY" \
  "SESSION_DRIVER=cookie" \
  "LIMITER_STORE=database" \
  'DB_HOST=${{Postgres.PGHOST}}' \
  'DB_PORT=${{Postgres.PGPORT}}' \
  'DB_USER=${{Postgres.PGUSER}}' \
  'DB_PASSWORD=${{Postgres.PGPASSWORD}}' \
  'DB_DATABASE=${{Postgres.PGDATABASE}}' \
  "ADONISPLUS_NPM_TOKEN=$TOKEN" \
  "SEED_DEMO_DATA=$SEED_DEMO_DATA"

# A new database publishes its variables a few seconds after it is created.
# Deploying before that leaves the DB_* references empty.
echo "Waiting for the database to be ready..."
for _ in $(seq 1 30); do
  if railway variable list --service Postgres --json 2>/dev/null | grep -q '"PGHOST": *"[^"]'; then
    break
  fi
  sleep 5
done

railway up --service "$SERVICE" --detach
railway domain --service "$SERVICE" --port 3333

echo
echo "Deploying. Follow the build with: railway logs --service $SERVICE --build"
