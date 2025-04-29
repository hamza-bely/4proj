# Étape de build
FROM node:22 AS build
WORKDIR /app

# Déclaration des variables
ARG VITE_API_URL
ARG VITE_TOMTOM_API_KEY
ARG VITE_LIBRETRANSLATE_API_KEY

# Les passer dans l’environnement (important pour Vite)
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_TOMTOM_API_KEY=$VITE_TOMTOM_API_KEY
ENV VITE_LIBRETRANSLATE_API_KEY=$VITE_LIBRETRANSLATE_API_KEY

COPY . .
RUN npm install
RUN npm run build
