# Utiliser l'image officielle de Node.js comme image de base
FROM node:22 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances de l'application Angular
RUN npm install

# Copier tous les fichiers du projet Angular dans le conteneur
COPY . .

# Construire l'application Angular
RUN npm run build --prod

# Installer Angular CLI globalement pour exécuter ng serve
RUN npm install -g @angular/cli

# Exposer le port 4200 (port par défaut d'Angular)
EXPOSE 4200

# Démarrer le serveur Angular sur le port 4200 (hôte 0.0.0.0 pour écouter sur toutes les interfaces)
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
