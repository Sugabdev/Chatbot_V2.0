#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKIP_INSTALL=false
SKIP_MIGRATIONS=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --skip-install) SKIP_INSTALL=true ;;
        --skip-migrations) SKIP_MIGRATIONS=true ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
    shift
done

echo -e "\e[36m=== Chatbot Dev Script ===\e[0m"

# ── 1. Install dependencies ──────────────────────────────────
if [ "$SKIP_INSTALL" = false ]; then
    echo -e "\n\e[33m[1/5] Installing frontend dependencies...\e[0m"
    cd "$ROOT_DIR/FE"
    pnpm install
    echo -e "\e[33m[2/5] Installing backend dependencies...\e[0m"
    cd "$ROOT_DIR/BE"
    poetry install
else
    echo -e "\n\e[33m[1/5] Skipping dependency installation\e[0m"
    echo -e "\e[33m[2/5] Skipping dependency installation\e[0m"
fi

# ── 2. Start PostgreSQL ──────────────────────────────────────
echo -e "\n\e[33m[3/5] Starting PostgreSQL container...\e[0m"
cd "$ROOT_DIR"
docker compose up -d db

echo -e "\e[90mWaiting for PostgreSQL to be ready...\e[0m"
for i in $(seq 1 30); do
    if docker compose exec -T db pg_isready -U postgres >/dev/null 2>&1; then
        break
    fi
    echo -n "."
    sleep 2
done
echo -e " \e[32mReady!\e[0m"

if ! docker compose exec -T db pg_isready -U postgres >/dev/null 2>&1; then
    echo -e "\e[31mPostgreSQL not ready after 60s\e[0m" >&2
    exit 1
fi

# ── 3. Run migrations ────────────────────────────────────────
if [ "$SKIP_MIGRATIONS" = false ]; then
    echo -e "\n\e[33m[4/5] Running database migrations...\e[0m"
    cd "$ROOT_DIR/BE"
    poetry run python manage.py migrate
else
    echo -e "\n\e[33m[4/5] Skipping migrations\e[0m"
fi

# ── 4. Start servers ─────────────────────────────────────────
echo -e "\n\e[33m[5/5] Starting servers...\e[0m"

cleanup() {
    echo -e "\n\e[36mStopping all servers...\e[0m"
    kill $PID_BE $PID_FE 2>/dev/null || true
    wait $PID_BE $PID_FE 2>/dev/null || true
    echo -e "\e[36mDone.\e[0m"
}
trap cleanup EXIT INT TERM

cd "$ROOT_DIR/BE"
poetry run daphne -b 0.0.0.0 -p 8000 chatbot.asgi:application &
PID_BE=$!

cd "$ROOT_DIR/FE"
pnpm dev &
PID_FE=$!

cd "$ROOT_DIR"

echo -e "\n  \e[32mBackend  → http://localhost:8000\e[0m"
echo -e "  \e[32mFrontend → http://localhost:5173\e[0m"
echo -e "  \e[32mDB       → postgres://postgres:postgres@localhost:5432/chatbot_db\e[0m"
echo -e "\n\e[36mPress Ctrl+C to stop all servers.\e[0m\n"

wait
