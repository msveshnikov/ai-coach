# Training Management System - Package Configuration Documentation

## Overview

This `package.json` file defines the configuration and dependencies for a Training Management System
built with React and Vite. The project appears to be a modern web application with features for
training management, utilizing various React ecosystem libraries and development tools.

## Project Details

- **Name**: training-management-system
- **Version**: 1.0.0
- **Type**: ES Module
- **Privacy**: Private package (not intended for npm publication)

## Scripts

```json
{
    "dev": "vite", // Starts development server
    "build": "vite build", // Creates production build
    "lint": "eslint .", // Runs ESLint for code quality
    "format": "prettier --write .", // Formats code using Prettier
    "autocode": "bunx autocode-ai" // Runs AI-assisted coding tool
}
```

## Dependencies

### Core Dependencies

- **React Stack**
    - `react` (v19.0.0): Core React library
    - `react-dom` (v19.0.0): React DOM rendering
    - `react-router-dom` (v7.1.1): Routing functionality

### UI Components and Styling

- **Chakra UI**
    - `@chakra-ui/react` (v2.10.3): Component library
    - `@chakra-ui/icons` (v2.2.4): Icon set
    - `@emotion/react` & `@emotion/styled`: Styling solution
    - `framer-motion`: Animation library

### State Management and Data Handling

- `react-query`: Data fetching and caching
- `axios`: HTTP client
- `socket.io-client`: Real-time communications

### Forms and Validation

- `formik`: Form handling
- `yup`: Schema validation

### Data Visualization

- `recharts`: Charting library
- `react-big-calendar`: Calendar component
- `react-markdown`: Markdown rendering

## Development Dependencies

### Build Tools

- `vite`: Build tool and development server
- `@vitejs/plugin-react`: React plugin for Vite
- `vite-plugin-pwa`: PWA support

### Code Quality Tools

- `eslint` and related plugins: Code linting
- `prettier`: Code formatting
- `workbox-window`: Service worker utilities

## Project Structure Integration

This `package.json` file sits at the root level of the project and supports:

- Frontend development (`/src` directory)
- Server-side code (`/server` directory)
- Documentation (`/docs` directory)
- Public assets (`/public` directory)

## Usage Examples

### Development

```bash
# Start development server
npm run dev

# Format code
npm run format

# Lint code
npm run lint
```

### Production

```bash
# Create production build
npm run build
```

## Requirements

- Node.js (version compatible with React 19)
- NPM or another package manager
- Modern web browser for development

## Notes

- The project uses modern React features (React 19)
- Includes PWA capabilities through `vite-plugin-pwa`
- Supports both client and server-side development
- Includes comprehensive testing and code quality tools
- Uses Docker for containerization (referenced by Dockerfile and docker-compose.yml)

## Related Files

- `.prettierrc`: Prettier configuration
- `vite.config.js`: Vite build configuration
- `docker-compose.yml`: Docker composition
- `Dockerfile`: Container definition

This documentation provides an overview of the package configuration. For specific implementation
details, refer to the individual component documentation in the source code.
