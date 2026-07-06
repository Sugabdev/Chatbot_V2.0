import os

os.system("poetry run daphne -b 0.0.0.0 -p 8000 chatbot.asgi:application")
