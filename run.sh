#!/bin/bash

echo "Lancement en local..."

if [ ! -f .env ]; then
  echo "Fichier .env manquant, création à partir de .env.example..."
  cp .env.example .env
fi

if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
  echo "Docker ou Docker Compose est manquant."
  exit 1
fi

docker-compose down

if [ "$1" == "build" ]; then
  docker-compose build
fi

docker-compose up -d

echo "Frontend : http://localhost:5181"
echo "Backend  : http://localhost:8080"

if [ "$2" == "logs" ]; then
  docker-compose logs -f
fi
