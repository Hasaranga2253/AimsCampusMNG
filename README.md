# AIMS Campus Management System

## Project Overview
AIMS is a campus academic management system being prepared as a full-stack workspace project. The current foundation focuses on frontend routing, role structure, shared project tooling, reserved backend architecture folders, and documentation.

## Technology Direction
### Frontend
- React
- TypeScript
- Tailwind CSS
- React Router
- Vite

### Backend
- NestJS REST API as the target backend architecture
- Swagger for API documentation
- environment-based configuration

### Database
- PostgreSQL planned for persistence
- Prisma planned for future schema and data access work

## System Actors
- Student
- Lecturer
- Internal Moderator
- Programme Coordinator
- Administrator

## Folder Structure
```text
AimsCampusMNG/
|-- frontend/
|-- backend/
|-- docs/
|-- package.json
|-- package-lock.json
`-- README.md
```

## Installation
```bash
npm install
```

## Workspace Commands
### Frontend Run Command
```bash
npm run dev:frontend
```

### Backend Run Command
```bash
npm run dev:backend
```

## Local URLs
- Frontend URL: `http://localhost:5173`
- Backend URL: `http://localhost:3001` planned target for the NestJS API
- Health endpoint: `http://localhost:3001/api/v1/health` planned target
- Swagger URL: `http://localhost:3001/api/docs` planned target

## Useful Commands
```bash
npm run lint
npm run build
```

## Current Completed Phase
Frontend foundation is in place with workspace setup, role and navigation configuration, routed placeholder pages, reserved backend source folders, and initial project documentation.

## Next Planned Phase
Scaffold the actual NestJS backend bootstrap, configure environment loading, CORS, validation, Swagger, and add the first health endpoint before moving into business modules and the future PostgreSQL plus Prisma data layer.
