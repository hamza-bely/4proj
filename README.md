# 4PROJ TRAFICANDME 

A comprehensive educational management system built with Node.js, React, and GraphQL.



Documentations : 50 points
(Une note inférieure à 30 points sur cette partie entraînera un ajournement à ce projet)

Documentation technique : 30 points
Manuel utilisateur : 20 points
Déploiement : 50 points
(Une note inférieure à 30 points sur cette partie entraînera un ajournement à ce projet)

Architecture : 30 points
Containérisation : 20 points
Fonctionnalités : 150 points
(Une note inférieure à 75 points sur cette partie entraînera un ajournement à ce projet)

- Connexion utilisateur : 10 points
- OAuth : 5 points
- Connexion standard : 5 points
- Affichage carte : 10 points
- Choix itinéraires : 30 points
- Plusieurs trajets proposés avec leur durée : 20 points
- Choix d’itinéraire sans péage : 5 points
- Choix des informations du trajet : 5 points
- Navigation en temps réel : 30 points
- Instructions de conduite : 20 points
- Géolocalisation et avancée visuelle du moyen de transport : 10 points
- Signalement d'incidents : 20 points
- Gestion des alertes : 40 points
- Vérification des infos à l'approche : 15 points
- Recalcul de l'itinéraire : 25 points
- Envoi de l'itinéraire vers le téléphone et génération de code QR : 10 points
- Sécurité : 30 points
- Chiffrement et sécurité des communications : 20 points
- Protection contre les attaques XSS/CSRF/SQL Injection : 10 points
- Data : 70 points
- Stockage et gestion des données : 30 points
- Analyse et statistiques des données de trafic : 20 points
- Prédiction des embouteillages : 20 points




## Project Team

- **Hamza Belyahiaoui**
- **Abdoul-waris Konate**
- **Fadel Biaou**
- **Jean-philippe Delon**


## Project Structure

```
schoolinc/
├── api-gateway/        # API Gateway service
├── user-service/       # User management service
├── course-service/     # Course management service
├── class-service/      # Class management service
├── grade-service/      # Grade management service
├── frontend/          # React frontend application

```

## Prerequisites

- Node.js (v22 or higher)
- npm (v10 or higher)
- MongoDB


## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd schoolinc
```

### 2. Install Dependencies

Install dependencies for each service:

```bash
# API Gateway
cd api-gateway
npm install

# User Service
cd ../user-service
npm install

# Course Service
cd ../course-service
npm install

# Class Service
cd ../class-service
npm install

# Grade Service
cd ../grade-service
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Environment Setup

Create `.env` files in each service directory with the following variables:

```env
# api-gateway/.env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/schoolinc
JWT_SECRET=your_jwt_secret

# user-service/.env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/schoolinc
JWT_SECRET=your_jwt_secret

# course-service/.env
PORT=3002
MONGODB_URI=mongodb://localhost:27017/schoolinc

# class-service/.env
PORT=3003
MONGODB_URI=mongodb://localhost:27017/schoolinc

# grade-service/.env
PORT=3004
MONGODB_URI=mongodb://localhost:27017/schoolinc

# frontend/.env
REACT_APP_API_URL=http://localhost:4000/graphql
```

### 4. Run Database Seeders

Seed the database with initial data:

```bash
# User Service
cd user-service
npm run seed

```

### 5. Start the Services

Start each service in a separate terminal:

```bash
# API Gateway
cd api-gateway
npm run dev

# User Service
cd user-service
npm run dev

# Course Service
cd course-service
npm run dev

# Class Service
cd class-service
npm run dev

# Grade Service
cd grade-service
npm run dev

# Frontend
cd frontend
npm run dev
```

## Running the Application

To run the application, follow these steps:

1. Make sure MongoDB is running on your system
2. Open a terminal and navigate to the project root directory
3. Start all services in separate terminals using the commands above
4. Access the application:
   - Frontend: http://localhost:5173
   - GraphQL Playground: http://localhost:4000/graphql
   - API Documentation: http://localhost:3000/docs/api/

## Default Users

The system comes with pre-seeded users:

### Admin
- Email: admin@example.com
- Password: admin123
- Role: ADMIN

### Professors
1. Professor 1
   - Email: professor1@example.com
   - Password: password123
   - Role: PROFESSOR

2. Professor 2
   - Email: professor2@example.com
   - Password: password123
   - Role: PROFESSOR

### Students
1. Student 1
   - Email: student1@example.com
   - Password: password123
   - Role: STUDENT

2. Student 2
   - Email: student2@example.com
   - Password: password123
   - Role: STUDENT

3. Student 3
   - Email: student3@example.com
   - Password: password123
   - Role: STUDENT

## API Documentation

The GraphQL API documentation is available at `http://localhost:3000/docs/api/`. To generate and serve the documentation:

```bash
# Generate documentation
npm run docs:build

# Serve documentation
npm run docs:serve
```

## Features

- User Authentication and Authorization
- Role-based Access Control (Admin, Professor, Student)
- Course Management
- Class Management
- Grade Management
- Student Management
- User Profile Management

## Development

### Running Tests

```bash
# Run tests for all services
npm test

# Run tests for a specific service
cd <service-directory>
npm test
```

### Code Style

```bash
# Format code
npm run format

# Lint code
npm run lint
```

## Testing

The project includes comprehensive test suites for each service. Tests are written using Jest and include both unit and integration tests.

### Test Structure

Each service has its own test directory with the following structure:

```
<service-name>/
├── src/
│   ├── tests/
│   │   ├── <service-name>.test.js    # Main test file
│   │   └── ...                       # Additional test files
```

### Running Tests

To run tests for all services:

```bash
# From the root directory
npm test
```

To run tests for a specific service:

```bash
cd <service-directory>
npm test
```

### Test Database

Tests use a separate test database to avoid interfering with development data:

```env
MONGODB_URI=mongodb://localhost:27017/schoolinc-test
```
