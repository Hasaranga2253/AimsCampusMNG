# Architecture

## Overview
AIMS is being structured as a workspace-based campus academic management platform with a separate frontend and backend.

## Frontend Foundation
The frontend is a React, TypeScript, Tailwind, and React Router application intended to deliver role-based user experiences for students, lecturers, moderators, coordinators, and administrators.

## Backend Foundation
The backend target architecture is a NestJS REST API with modular domain organization, shared common utilities, environment-based configuration, and Swagger-based API documentation.

## Integration Direction
The frontend and backend are intended to communicate over HTTP, with the frontend running on `http://localhost:5173` and the backend API planned for `http://localhost:3001`.
