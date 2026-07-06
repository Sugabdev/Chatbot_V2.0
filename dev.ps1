param(
    [switch]$skipInstall,
    [switch]$skipMigrations
)

$ErrorActionPreference = "Stop"

Write-Host "=== Chatbot Dev Script ===" -ForegroundColor Cyan

# ── 1. Install dependencies ──────────────────────────────────
if (-not $skipInstall) {
    Write-Host "`n[1/5] Installing frontend dependencies..." -ForegroundColor Yellow
    Push-Location FE
    pnpm install
    if ($LASTEXITCODE -ne 0) { throw "pnpm install failed" }
    Pop-Location

    Write-Host "[2/5] Installing backend dependencies..." -ForegroundColor Yellow
    Push-Location BE
    poetry install
    if ($LASTEXITCODE -ne 0) { throw "poetry install failed" }
    Pop-Location
} else {
    Write-Host "`n[1/5] Skipping dependency installation" -ForegroundColor DarkYellow
    Write-Host "[2/5] Skipping dependency installation" -ForegroundColor DarkYellow
}

# ── 2. Start PostgreSQL ──────────────────────────────────────
Write-Host "`n[3/5] Starting PostgreSQL container..." -ForegroundColor Yellow
docker compose up -d db
if ($LASTEXITCODE -ne 0) { throw "docker compose failed" }

Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Gray
$maxRetries = 30
$retryCount = 0
do {
    $result = docker compose exec -T db pg_isready -U postgres 2>$null
    if ($LASTEXITCODE -eq 0) { break }
    $retryCount++
    Write-Host "." -NoNewline
    Start-Sleep -Seconds 2
} while ($retryCount -lt $maxRetries)

if ($retryCount -ge $maxRetries) { throw "PostgreSQL not ready after 60s" }
Write-Host " Ready!" -ForegroundColor Green

# ── 3. Run migrations ────────────────────────────────────────
if (-not $skipMigrations) {
    Write-Host "`n[4/5] Running database migrations..." -ForegroundColor Yellow
    Push-Location BE
    poetry run python manage.py migrate
    if ($LASTEXITCODE -ne 0) { throw "migrations failed" }
    Pop-Location
} else {
    Write-Host "`n[4/5] Skipping migrations" -ForegroundColor DarkYellow
}

# ── 4. Start servers ─────────────────────────────────────────
Write-Host "`n[5/5] Starting servers..." -ForegroundColor Yellow

$rootDir = $PWD

Start-Process pwsh -ArgumentList "-NoExit", "-NoLogo", "-Command", "cd '$rootDir\BE'; poetry run daphne -b 0.0.0.0 -p 8000 chatbot.asgi:application"
Start-Sleep -Seconds 2
Start-Process pwsh -ArgumentList "-NoExit", "-NoLogo", "-Command", "cd '$rootDir\FE'; pnpm dev"

Write-Host "`n  Backend  → http://localhost:8000  (new window)" -ForegroundColor Green
Write-Host "  Frontend → http://localhost:5173  (new window)" -ForegroundColor Green
Write-Host "  DB       → postgres://postgres:postgres@localhost:5432/chatbot_db" -ForegroundColor Green

Write-Host "`nClose the server windows or press Ctrl+C in each to stop.`n" -ForegroundColor Cyan
