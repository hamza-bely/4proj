# TraficAndMe - Application de Navigation en Temps Réel

## Contexte du Projet

La société Trafine souhaite développer "TraficAndMe", une application de navigation en temps réel similaire à Waze, qui permettra aux utilisateurs de recevoir des informations sur la circulation, les accidents et les obstacles en France métropolitaine. Cette application offrira également aux utilisateurs la possibilité de signaler des incidents et de recevoir des itinéraires optimisés en fonction des conditions de circulation actuelles.

Le projet comprend trois composantes principales :
- Une application mobile pour les utilisateurs finaux
- Une interface web pour la gestion et la visualisation des données en temps réel
- Une architecture de micro-services pour gérer les différentes fonctionnalités

Pour la phase bêta, TraficAndMe se concentrera sur les trajets en France métropolitaine.

## État Actuel du Projet

Selon la grille d'évaluation, plusieurs fonctionnalités ont déjà été implémentées sur la plateforme web, tandis que les versions mobile et API sont encore en développement.

## Évaluation des Fonctionnalités par Plateforme

| Catégorie                          | Sous-catégorie                                | Points | Web  | Mobile | API |
|-----------------------------------|------------------------------------------------|--------|------|--------|-----|
| **Documentation** (50 pts)        | Documentation technique                        | 30     | ✅   | ❌     | ❌  |
|                                   | Manuel utilisateur                             | 20     | ✅   | ❌     | ❌  |
| **Déploiement** (50 pts)          | Architecture                                   | 30     | ✅   | ❌     | ⚠️  |
|                                   | Containérisation                               | 20     | ✅   | ❌     | ⚠️  |
| **Fonctionnalités** (150 pts)     |                                                |        |      |        |     |
| Authentification utilisateur      | OAuth                                          | 5      | ❌   | ❌    | ✅   |
|                                   | Connexion standard                             | 5      | ✅   | ❌    | ✅   |
| Carte                             | Affichage carte                                | 10     | ✅   | ❌    | ✅   |
|                                   | Choix itinéraires                              | 30     | ✅   | ❌    | ✅   |
|                                   | Plusieurs trajets avec durée                   | 20     | ✅   | ❌    | ✅   |
|                                   | Itinéraire sans péage                          | 5      | ✅   | ❌    | ✅   |
|                                   | Choix infos du trajet                          | 5      | ❌   | ❌    | ⚠️   |
| Navigation en temps réel          | Navigation live                                | 30     | ✅   | ❌    | ✅   |
|                                   | Instructions de conduite                       | 20     | ❌   | ❌    | ⚠️   |
|                                   | Géolocalisation et visualisation transport     | 10     | ✅   | ❌    | ✅   |
| Signalements                      | Signalement d'incidents                        | 20     | ✅   | ❌    | ✅   |
| Alertes                           | Gestion des alertes                            | 40     | ❌   | ❌    | ⚠️   |
|                                   | Vérification à l'approche                      | 15     | ❌   | ❌    | ❌   |
|                                   | Recalcul d'itinéraire                          | 25     | ✅   | ❌    | ✅   |
| Partage                           | Partage vers téléphone + QR                    | 10     | ❌   | ❌    | ❌   |
| Sécurité                          | Chiffrement & sécurité des communications      | 20     | ✅   | ❌    | ✅   |
|                                   | Protection XSS/CSRF/SQLi                       | 10     | ✅   | ❌    | ✅   |
| Données                           | Stockage & gestion des données                 | 30     | ✅   | ❌    | ✅   |
|                                   | Analyse & stats de trafic                      | 20     | ✅   | ❌    | ⚠️   |
|                                   | Prédiction des embouteillages                  | 20     | ✅   | ❌    | ⚠️   |

Légende:
- ✅ Fonctionnalité implémentée
- ⚠️ Fonctionnalité en cours de développement
- ❌ Fonctionnalité non implémentée

## Résumé des Progrès

À ce jour, nous avons réalisé des progrès significatifs sur la plateforme web de TraficAndMe. Les fonctionnalités principales incluent l'affichage de cartes interactives, la navigation en temps réel, le signalement d'incidents et la prédiction d'embouteillages. La version web dispose également d'un système robuste de sécurité et de gestion des données.

Cependant, l'application mobile est encore en phase initiale de développement et nécessite une attention particulière pour atteindre les objectifs fixés. L'API est partiellement développée pour soutenir les fonctionnalités existantes de la plateforme web, mais nécessite des améliorations pour prendre en charge toutes les fonctionnalités prévues.

## Équipe du Projet

- **Hamza Belyahiaoui** - Développeur Full Stack / Chef de Projet
- **Abdoul-waris Konate** - Développeur Back-End / Architecture des microservices
- **Fadel Biaou** - Développeur Front-End / UX Designer
- **Jean-philippe Delon** - Développeur Mobile / Spécialiste en Intelligence artificielle 

## Structure du Projet

```
traficandme/
├── api-traficandme/        # Service API 
├── web-traficandme/        # Application web pour utilisateurs et administrateurs
├── mobile-traficandme/     # Application mobile pour utilisateurs
```

## Prérequis Techniques

- Node.js (v22 ou supérieur)
- npm (v10 ou supérieur)
- Docker et Docker Compose
- java v17
- API de cartographie "Tomtom map"

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/trafine/traficandme.git
cd traficandme
```

### 2. Installer les Dépendances

Installer les dépendances pour chaque service:

```bash
# Front-End 
cd web-traficandme
./mvnw spring-boot:run

# Mobile
cd ../mobile-traficandme
npm install

# API
cd ../api-traficandme
npm install
```

### 4. Initialiser la Base de Données

Initialiser la base de données avec les données initiales:

```bash
Processus automatique après le lancement du projet
```

### 5. Démarrer les Services

Démarrer chaque service dans un terminal séparé:

```bash
# API
cd api-traficandme
./mvnw spring-boot:run

# Front-End
cd web-traficandme
npm run dev

# Mobile (développement)
cd mobile-traficandme
npx expo start
```

## Utilisation de l'Application

Pour utiliser l'application, suivez ces étapes:

1. Assurez-vous que MongoDB est en cours d'exécution sur votre système
2. Ouvrez un terminal et naviguez vers le répertoire racine du projet
3. Démarrez tous les services dans des terminaux séparés en utilisant les commandes ci-dessus
4. Accédez à l'application:
   - Front-End Web: http://localhost:5173
   - Documentation API: http://localhost:8080/swagger-ui/indeX.html
   - API: http://localhost:8080/api

## Utilisateurs par Défaut

Le système est fourni avec des utilisateurs pré-configurés:

### Administrateur
- Email: admin@traficandme.com
- Mot de passe: AdminPass123!
- Rôle: ADMIN

### Utilisateur
- Email: hamza.bely@traficandme.com
- Mot de passe: UserPass123!
- Rôle: USER

## Documentation de l'API

La documentation de l'API est disponible à l'adresse `http://localhost:8080/swagger-ui/indeX.html`. Pour générer et servir la documentation:

## Fonctionnalités Principales

- Authentification et autorisation des utilisateurs
- Affichage de cartes interactives
- Navigation en temps réel avec instructions
- Signalement d'incidents (accidents, travaux, embouteillages)
- Calcul et recalcul d'itinéraires optimisés
- Analyse et statistiques de trafic
- Prédiction des embouteillages
- Partage d'itinéraires entre appareils


### Exécution des Tests

//TODO ------
```bash
# Exécuter les tests pour tous les services
npm test

# Exécuter les tests pour un service spécifique
cd <répertoire-du-service>
npm test
```

## Déploiement

Le projet utilise Docker pour la conteneurisation et peut être déployé facilement sur différentes plateformes:

```bash
# Construire les images Docker
docker-compose build

# Démarrer les services
docker-compose up -d
```

## Roadmap

Priorités pour les prochaines phases de développement:

1. Finaliser le développement de l'application mobile
2. Implémenter la fonctionnalité de gestion des alertes
3. Ajouter le partage d'itinéraires via QR code
4. Améliorer les instructions de conduite en temps réel
5. Étendre la couverture géographique au-delà de la France métropolitaine
