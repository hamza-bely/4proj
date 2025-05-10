# TraficAndMe - Application de Navigation en Temps Réel

## Contexte du Projet

La société Trafine développe "TraficAndMe", une application de navigation en temps réel similaire à Waze. Elle permet aux utilisateurs de recevoir des informations sur la circulation, les accidents et les obstacles en France métropolitaine. Les utilisateurs peuvent signaler des incidents et obtenir des itinéraires optimisés en fonction des conditions de circulation actuelles.

Le projet comprend trois composantes principales :
- **Application mobile** pour les utilisateurs finaux
- **Interface web** pour la gestion et la visualisation des données en temps réel
- **Architecture backend** pour gérer les différentes fonctionnalités

Pour la phase bêta, TraficAndMe se concentre sur les trajets en France métropolitaine.


## Équipe du Projet

- **Hamza Belyahiaoui** - Développeur Full Stack / Chef de Projet
- **Abdoul-waris Konate** - Développeur Back-End / Architecture
- **Fadel Biaou** - Développeur Front-End / UX Designer
- **Jean-Philippe Delon** - Développeur Mobile / Spécialiste en Intelligence Artificielle

## Fonctionnalités Principales

- Authentification et autorisation des utilisateurs
- Affichage de cartes interactives
- Navigation en temps réel avec instructions
- Signalement d'incidents (accidents, travaux, embouteillages)
- Calcul et recalcul d'itinéraires optimisés
- Analyse et statistiques de trafic
- Prédiction des embouteillages
- Partage d'itinéraires entre appareils


## Architecture du Projet

TraficAndMe utilise une architecture monolithique avec les technologies suivantes :

- **Backend** : Spring Boot (Java)
- **Frontend** : React + Vite + TypeScript
- **Base de données** : PostgreSQL
- **Cartographie** : API "Tomtom map"

## Structure du Projet

```
traficandme/
├── api-traficandme/        # Service API (Spring Boot)
├── web-traficandme/        # Application web (React + Vite + TypeScript)
├── mobile-traficandme/     # Application mobile (React Native avec Expo)
```

## Prérequis Techniques

- Node.js (v22 ou supérieur)
- npm (v10 ou supérieur)
- Docker et Docker Compose (pour le déploiement conteneurisé)
- Java v17
- PostgreSQL

## Installation et Démarrage

Vous pouvez lancer le projet de deux manières : avec Docker ou en local.

### 1. Déploiement avec Docker

1. Cloner le dépôt :
```bash
git clone https://github.com/trafine/traficandme.git
cd traficandme
```

2. Créer un fichier `.env` à la racine du projet (contactez l'équipe pour obtenir les variables d'environnement nécessaires)

3. Lancer les conteneurs avec le script de démarrage(dans du bash(EX: git bash ou le terminal de vs code)  :
```bash
./run.sh
```

### 2. Installation locale

1. Cloner le dépôt :
```bash
git clone https://github.com/trafine/traficandme.git
cd traficandme
```

2. Configurer PostgreSQL en local

3. Pour lancer le frontend web :
```bash
cd web-traficandme
# Ajouter le fichier .env
npm install
npm run dev
```

4. Pour lancer l'API :
```bash
cd api-traficandme
./mvnw clean install
./mvnw spring-boot:run
```

5. Pour lancer l'application mobile :

```bash
cd mobile
npm install
npx expo start
```

Vous avez deux options pour lancer l’application sur un appareil :

📱  Option 1 : Utiliser Expo Go
Installez l'application Expo Go sur votre smartphone :

Expo Go sur Android

Expo Go sur iOS

Lancez la commande npx expo start

Scannez le QR code affiché dans le terminal ou dans la page web avec l'application Expo Go

💻 Option 2 : Utiliser un émulateur avec Android Studio
Installez Android Studio : https://developer.android.com/studio

Créez un appareil virtuel (émulateur) via le AVD Manager

Lancez npx expo start, puis appuyez sur la touche "a" dans le terminal pour ouvrir l’application sur l’émulateur Android

Lorsque vous travaillez avec une API locale (ex. via Docker), n'utilisez pas localhost ou 127.0.0.1 dans votre application mobile.

 À faire :
Dans le fichier .env, utilisez l'adresse IP locale de votre ordinateur (visible via ipconfig sous Windows ou ifconfig/ip a sous Linux/Mac). Par exemple :
```bash
EXPO_PUBLIC_API_URL=http://192.168.1.65:8080/
```

Cela permet à l'application mobile sur le téléphone (ou l’émulateur) d'accéder à l'API qui tourne sur votre machine.



## Lancement des tests
**Pour lancer les tests back-end:**
```bash
cd api-traficandme
./mvnw test
ou
./mvnw -Dtest=YourTestClass test
```
**les classes de tests sont:** `UserRepositoryTest, ReportRepositoryTest, ItineraryRepositoryTest, ReportServiceTest, ItineraryServiceTest`
## Accès aux Applications

- **Frontend Web** : http://localhost:5181
- **Documentation API** : http://localhost:8080/swagger-ui/index.html
- **API** : http://localhost:8080/api

## Utilisateurs par Défaut

Le système est fourni avec des utilisateurs pré-configurés :

### Administrateur
- Email : admin@traficandme.com
- Mot de passe : AdminPass123!
- Rôle : ADMIN

### Utilisateur
- Email : hamza.bely@traficandme.com
- Mot de passe : UserPass123!
- Rôle : USER

### Modérateur
- Email : moderator.@traficandme.com
- Mot de passe : ModeratorPass123!
- Rôle : MODERATOR
