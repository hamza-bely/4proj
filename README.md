# 4PROJ TRAFICANDME 


```
# Project Evaluation Criteria

This document outlines the evaluation criteria for the project, highlighting the implementation status across web, mobile, and API components.



# Project Evaluation Criteria

This document outlines the evaluation criteria for the project, highlighting the implementation status across web, mobile, and API components.
# Project Evaluation Criteria

## Key Requirements
- Minimum score requirements:
  - Documentation: 30/50 points
  - Deployment: 30/50 points
  - Features: 75/150 points

## Grading Table

### Documentation (50 points)
| Item | Points | Status |
|------|--------|--------|
| Technical Documentation | 30 | Pending |
| User Manual | 20 | Pending |

### Deployment (50 points)
| Item | Points | Status |
|------|--------|--------|
| Architecture | 30 | Pending |
| Containerization | 20 | Pending |

### Features (150 points)

#### User Authentication
| Feature | Points | Web | Mobile |
|---------|--------|-----|--------|
| OAuth | 5 | No | No |
| Standard Login | 5 | Yes | No |

#### Map Features
| Feature | Points | Web | Mobile |
|---------|--------|-----|--------|
| Map Display | 10 | Yes | No |
| Route Selection | 30 | Yes | No |
| Multiple Route Options with Duration | 20 | Yes | No |
| Toll-Free Route Options | 5 | Yes | No |
| Trip Information Selection | 5 | No | No |

#### Navigation
| Feature | Points | Web | Mobile |
|---------|--------|-----|--------|
| Live Navigation | 30 | Yes | No |
| Driving Instructions | 20 | No | No |
| Geolocation and Transport Visualization | 10 | Yes | No |

#### Incident & Alerts
| Feature | Points | Web | Mobile |
|---------|--------|-----|--------|
| Incident Reporting | 20 | Yes | No |
| Alert Management | 40 | No | No |
| Proximity Information Verification | 15 | No | No |
| Route Recalculation | 25 | Yes | No |

#### Additional Features
| Feature | Points | Web | Mobile |
|---------|--------|-----|--------|
| Route Sharing (QR Code) | 10 | No | No |
| Communication Encryption | 20 | Yes | No |
| XSS/CSRF/SQL Injection Protection | 10 | Yes | No |
| Data Storage and Management | 30 | Yes | No |
| Traffic Analysis & Statistics | 20 | Yes | No |
| Traffic Jam Prediction | 20 | Yes | No |

## Current Progress
- Web application: Many features implemented
- Mobile application: Development not started
- API implementation: In progress

## Development Priorities
1. Mobile implementation
2. Alert management system
3. Driving instructions feature
4. Route sharing functionality

## Progress Summary

Currently, most features have been implemented for web, while mobile development remains pending. The project shows strong implementation in map functionality, real-time navigation, security, and data management areas on the web platform.

## Development Priorities

Based on the evaluation table, the following areas require immediate attention:
1. Mobile implementation across all features
2. Alert management system for web platform
3. Trip information selection and driving instructions for web platform
4. Route sharing functionality







## Progress Summary

Currently, most feature
```





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
