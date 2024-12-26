# Server Package.json Documentation

## Overview

This file defines the Node.js package configuration for the backend server component of the
AI-powered coaching platform. It specifies project metadata, dependencies, scripts, and runtime
requirements.

## Project Role

Located in the `/server` directory, this `package.json` file manages dependencies and configuration
specifically for the backend server, separate from the main frontend application's package
configuration.

## Basic Information

```json
{
    "name": "coach-ai-server",
    "version": "1.0.0",
    "description": "Backend server for AI-powered coaching platform",
    "main": "index.js",
    "type": "module"
}
```

## Scripts

- `dev`: Runs the server in development mode using nodemon for auto-reloading
    ```bash
    npm run dev
    ```

## Dependencies

### Core Framework & Utilities

- `express` (^4.21.2): Web application framework
- `mongoose` (^8.9.2): MongoDB object modeling tool
- `dotenv` (^16.4.7): Environment variable management

### Security

- `bcryptjs` (^2.4.3): Password hashing
- `jsonwebtoken` (^9.0.2): JWT authentication
- `helmet` (^8.0.0): Security headers middleware
- `cors` (^2.8.5): Cross-Origin Resource Sharing
- `express-rate-limit` (^7.5.0): Request rate limiting

### Performance & Monitoring

- `compression` (^1.7.5): Response compression
- `morgan` (^1.10.0): HTTP request logger

### File Handling & AI

- `multer` (^1.4.5-lts.1): File upload handling
- `openai` (^4.77.0): OpenAI API integration

### Real-time Communication

- `socket.io` (^4.7.4): WebSocket implementation

### Development Dependencies

- `nodemon` (^3.1.9): Development server with auto-reload

## Engine Requirements

```json
"engines": {
    "node": ">=18.0.0"
}
```

## Installation

```bash
# Install all dependencies
npm install

# Install only production dependencies
npm install --production
```

## Usage

1. Create a `.env` file in the server directory with required environment variables
2. Install dependencies using `npm install`
3. Run development server:
    ```bash
    npm run dev
    ```

## Key Features

- ES Modules support enabled (`"type": "module"`)
- Comprehensive security middleware
- Real-time communication capabilities
- AI integration ready
- MongoDB database support
- File upload handling
- Rate limiting and compression for performance

## Dependencies Version Management

All dependencies use caret (^) versioning to allow compatible updates while maintaining stability.

## Development Workflow

The package is configured for a development workflow with:

- Hot reloading through nodemon
- HTTP request logging
- Security best practices
- Performance optimization middlewares

## Related Files

- `server/index.js`: Main server application entry point
- `docker-compose.yml`: Container orchestration (if using Docker)
- `Dockerfile`: Container configuration
