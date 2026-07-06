# Chatbot

Monorepositorio con frontend (`FE/`) y backend (`BE/`) para un chatbot con React + Django.

## Requisitos

- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/)
- [Python](https://www.python.org/) (3.13+)
- [Poetry](https://python-poetry.org/)
- [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/)

## Primeros pasos

```bash
# Windows (PowerShell)
.\dev.ps1

# Linux / macOS
chmod +x dev.sh && ./dev.sh
```

Esto instala dependencias, levanta PostgreSQL en Docker, corre migraciones e inicia ambos servidores.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `.\dev.ps1` / `./dev.sh` | Instalación completa + servidores |
| `.\dev.ps1 -skipInstall` / `./dev.sh --skip-install` | Salta instalación de dependencias |
| `.\dev.ps1 -skipMigrations` / `./dev.sh --skip-migrations` | Salta migraciones |

## Servidores

| Servicio | URL |
|---|---|
| Frontend (Vite) | http://localhost:5173 |
| Backend (Daphne) | http://localhost:8000 |
| Base de datos (PostgreSQL) | `postgres://postgres:postgres@localhost:5432/chatbot_db` |

Para detalles técnicos de cada componente, ver `FE/README.md` y `BE/README.md`.
