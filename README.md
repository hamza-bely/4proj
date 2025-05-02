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

3. Lancer les conteneurs avec le script de démarrage :
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
./mvnw spring-boot:run
```

5. Pour lancer l'application mobile :
```bash
cd mobile-traficandme
npm install
npx expo start
```

## Accès aux Applications

- **Frontend Web** : http://localhost:5173
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
- Email : moderator@traficandme.com
- Mot de passe : ModeratorPass123!
- Rôle : MODERATOR

## État Actuel du Projet

Le tableau ci-dessous présente l'état d'avancement des fonctionnalités par plateforme :

| Catégorie                          | Sous-catégorie                                | Points | Web  | Mobile | API |
|-----------------------------------|------------------------------------------------|--------|------|--------|-----|
| **Documentation** (50 pts)        | Documentation technique                        | 30     | ✅   | ❌     | ❌  |
|                                   | Manuel utilisateur                             | 20     | ✅   | ❌     | ❌  |
| **Déploiement** (50 pts)          | Architecture                                   | 30     | ✅   | ❌     | ⚠️  |
|                                   | Containérisation                               | 20     | ✅   | ❌     | ⚠️  |
| **Fonctionnalités** (150 pts)     |                                                |        |      |        |     |
| Authentification utilisateur      | OAuth                                          | 5      | ❌   | ❌    | ✅  |
|                                   | Connexion standard                             | 5      | ✅   | ✅    | ✅  |
| Carte                             | Affichage carte                                | 10     | ✅   | ✅    | ✅  |
|                                   | Choix itinéraires                              | 30     | ✅   | ✅    | ✅  |
|                                   | Plusieurs trajets avec durée                   | 20     | ✅   | ✅    | ✅  |
|                                   | Itinéraire sans péage                          | 5      | ✅   | ❌    | ✅  |
|                                   | Choix infos du trajet                          | 5      | ❌   | ❌    | ⚠️  |
| Navigation en temps réel          | Navigation live                                | 30     | ✅   | ⚠️    | ✅  |
|                                   | Instructions de conduite                       | 20     | ❌   | ✅    | ⚠️  |
|                                   | Géolocalisation et visualisation transport     | 10     | ✅   | ❌    | ✅  |
| Signalements                      | Signalement d'incidents                        | 20     | ✅   | ✅    | ✅  |
| Alertes                           | Gestion des alertes                            | 40     | ❌   | ❌    | ⚠️  |
|                                   | Vérification à l'approche                      | 15     | ❌   | ❌    | ❌  |
|                                   | Recalcul d'itinéraire                          | 25     | ✅   | ⚠️    | ✅  |
| Partage                           | Partage vers téléphone + QR                    | 10     | ❌   | ❌    | ❌  |
| Sécurité                          | Chiffrement & sécurité des communications      | 20     | ✅   | ❌    | ✅  |
|                                   | Protection XSS/CSRF/SQLi                       | 10     | ✅   | ❌    | ✅  |
| Données                           | Stockage & gestion des données                 | 30     | ✅   | ❌    | ✅  |
|                                   | Analyse & stats de trafic                      | 20     | ✅   | ❌    | ⚠️  |
|                                   | Prédiction des embouteillages                  | 20     | ✅   | ❌    | ⚠️  |

Légende :
- ✅ Fonctionnalité implémentée
- ⚠️ Fonctionnalité en cours de développement
- ❌ Fonctionnalité non implémentée


## Roadmap

Priorités pour les prochaines phases de développement :

1. Finaliser le développement de l'application mobile
2. Implémenter la fonctionnalité de gestion des alertes
3. Ajouter le partage d'itinéraires via QR code
4. Améliorer les instructions de conduite en temps réel
5. Étendre la couverture géographique au-delà de la France métropolitaine
