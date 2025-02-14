# Utiliser l'image officielle de Node.js comme image de base
FROM node:16 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances de l'application Angular
RUN npm install

# Copier tous les fichiers du projet Angular dans le conteneur
COPY . .

# Construire l'application Angular pour la production
RUN npm run build --prod

# Utiliser une image NGINX pour servir l'application construite
FROM nginx:alpine

# Copier les fichiers de build Angular dans le répertoire NGINX
COPY --from=build /app/dist/ /usr/share/nginx/html

# Exposer le port 4200 (par défaut pour Angular en dev)
EXPOSE 4200

# Commande pour démarrer NGINX en écoutant sur le port 4200
CMD ["nginx", "-g", "daemon off;", "-p", "4200"]
