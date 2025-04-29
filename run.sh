#!/bin/bash

# Script pour lancer l'application dans différents environnements

# Détecter l'environnement
if [ "$1" == "prod" ] || [ "$1" == "production" ]; then
    echo "Lancement en mode production (VPS)..."
    # Utiliser le fichier .env.production
    cp .env.production .env
    ENV_TYPE="production"
else
    echo "Lancement en mode développement (local)..."
    # Utiliser le fichier .env par défaut ou en créer un si nécessaire
    if [ ! -f .env ]; then
        echo "Fichier .env non trouvé, création d'un fichier par défaut..."
        cp .env.example .env
    fi
    ENV_TYPE="development"
fi

# Vérifier la présence de Docker et Docker Compose
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
    echo "Docker ou Docker Compose n'est pas installé. Veuillez les installer avant de continuer."
    exit 1
fi

# Arrêter les conteneurs existants et les supprimer
echo "Arrêt des conteneurs existants..."
docker-compose down

# Reconstruire les images si nécessaire
if [ "$2" == "build" ]; then
    echo "Reconstruction des images Docker..."
    docker-compose build
fi

# Démarrer les conteneurs
echo "Démarrage des conteneurs en mode $ENV_TYPE..."
docker-compose up -d

echo "Application démarrée avec succès!"
echo "Frontend accessible à: http://localhost:5181"
echo "Backend accessible à: http://localhost:8080"

# Afficher les logs si demandé
if [ "$3" == "logs" ]; then
    echo "Affichage des logs..."
    docker-compose logs -f
fi