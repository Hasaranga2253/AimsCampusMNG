# API Documentation

## Purpose
This document is the foundation for the future AIMS REST API contract.

## Planned API Style
The backend is planned as a versioned REST API using a global prefix of `api/v1` and Swagger documentation exposed from `api/docs`.

## Initial Endpoint Direction
The first planned public technical endpoint is a health check at `/api/v1/health`, which will confirm service availability once the NestJS backend bootstrap is in place.

## Future Scope
Later API documentation will cover request and response DTOs, validation rules, error formats, module endpoints, and role-based access behavior.
