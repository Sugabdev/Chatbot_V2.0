# Backend

API REST y WebSockets para el chatbot, construida con Django + Django REST Framework + Channels.

## Tecnologías

- **Django 6.0** + **Django REST Framework**
- **Daphne** (servidor ASGI)
- **Channels** + WebSockets para streaming de respuestas en tiempo real
- **PostgreSQL** como base de datos
- **SimpleJWT** con cookies httpOnly para autenticación
- **OpenRouter API** como proveedor de IA

## Requisitos

- Python 3.13+
- [Poetry](https://python-poetry.org/)
- PostgreSQL (o el contenedor definido en `docker-compose.yaml` de la raíz)

## Primeros pasos

```bash
# Instalar dependencias
poetry install

# Activar el entorno virtual
poetry shell

# Ejecutar migraciones
python manage.py migrate

# Iniciar servidor de desarrollo
poetry run daphne -b 0.0.0.0 -p 8000 chatbot.asgi:application
```

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DEBUG` | Modo debug de Django | `True` |
| `SECRET_KEY` | Clave secreta de Django | `nA75fIHONRKhjqTPrjhA4dob...` |
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgres://postgres:postgres@127.0.0.1:5432/chatbot_db` |
| `OPENROUTER_API_KEY` | API key de OpenRouter | `sk-or-v1-...` |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos para CORS | `['http://localhost:5173']` |

## Endpoints

### Autenticación (`/api/auth/`)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login/` | Iniciar sesión |
| POST | `/api/auth/logout/` | Cerrar sesión |
| GET | `/api/auth/me/` | Obtener usuario autenticado |
| POST | `/api/auth/refresh/` | Refrescar token de acceso |

### Usuarios (`/api/users/`)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/users/` | Crear usuario |
| PATCH | `/api/users/{id}/` | Actualizar usuario |
| DELETE | `/api/users/{id}/` | Eliminar usuario |

### Chats (`/api/chats/`)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/chats/{user_id}/` | Obtener chats de un usuario |
| DELETE | `/api/chats/{chat_id}/` | Eliminar un chat |

### Mensajes (`/api/chats/messages/`)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/chats/messages/{chat_id}/` | Obtener mensajes de un chat |

### WebSockets

| Ruta | Descripción |
|---|---|
| `ws://localhost:8000/ws/chats/` | Conexión WebSocket para enviar y recibir mensajes del chat con streaming |

El cliente WebSocket envía mensajes JSON con los siguientes tipos de evento:
- `start_chat` — inicia un nuevo chat
- `continue_chat_auth` — continúa un chat existente (usuario autenticado)
- `continue_chat_free` — continúa un chat sin autenticación

## Admin

```bash
# Crear superusuario
python manage.py createsuperuser

# Acceder al panel
http://localhost:8000/admin/
```
