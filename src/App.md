# App.jsx Documentation

## Overview

`App.jsx` is the main component of the AI Coach application, a React-based web application that
generates customized football training sessions using AI. The component integrates with Chakra UI
for styling and layout, and communicates with an API to generate training plans.

## Key Features

- Training configuration form
- AI-powered training generation
- Interactive visualization of training exercises
- Dark/light mode toggle
- Responsive design

## Dependencies

```javascript
import { ChakraProvider, ... } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import Exercise from './Exercise'
```

## Constants

### API_URL

```javascript
const API_URL = 'https://allchat.online/api';
```

Base URL for API communications.

### PROMPT_TEMPLATE

A template string that structures the AI prompt for generating training sessions. Includes
parameters and JSON schema for training diagrams.

### exercise

Default exercise configuration object following the JSON schema for training visualization.

## Component State

```javascript
const [trainingType, setTrainingType] = useState('exercise');
const [ageGroup, setAgeGroup] = useState('');
const [playerCount, setPlayerCount] = useState('');
// ... additional state variables
```

## Main Functions

### cleanGeneratedCode

```javascript
function cleanGeneratedCode(code: string): string | null
```

Extracts JSON code blocks from the AI response.

**Parameters:**

- `code`: Raw response text containing code blocks

**Returns:**

- Cleaned JSON string or null if no match found

### generateTraining

```javascript
const generateTraining = async () => void
```

Handles the API call to generate training sessions.

- Constructs prompt from form data
- Makes API request with authentication
- Updates UI with response
- Handles success/error states

## Component Structure

1. ChakraProvider wrapper
2. Main container with dark/light mode toggle
3. Tab-based interface:
    - Configuration tab with form inputs
    - Generated training tab with visualization and markdown content
4. Footer section

## Usage Example

```jsx
import App from './App';

function Root() {
    return <App />;
}
```

## Integration Points

- Connects with `Exercise.jsx` for training visualization
- Communicates with external API for training generation
- Uses environment variables for API authentication

## Error Handling

- Toast notifications for success/error states
- Try-catch blocks for API communication
- JSON parsing error handling

## Project Context

This file serves as the main application component in a larger project structure that includes:

- Server-side components (`/server`)
- Documentation (`/docs`)
- Public assets (`/public`)
- Additional React components (`/src`)

## Notes

- Requires valid API token in environment variables
- Depends on Chakra UI for styling
- Uses Vite as build tool
- Supports responsive design patterns
- Implements dark/light mode theming

## Future Considerations

- Add input validation
- Implement caching for generated trainings
- Add export functionality
- Enhance error handling
- Add user authentication
- Implement training history

## Related Files

- `Exercise.jsx`: Visualization component
- `schema.json`: Training diagram schema
- `vite.config.js`: Build configuration
- `main.jsx`: Application entry point

This documentation provides a comprehensive overview of the `App.jsx` component and its role in the
AI Coach application. For specific implementation details, refer to the inline comments in the
source code.
