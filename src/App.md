# App.jsx Documentation

## Overview

`App.jsx` serves as the root component of the React application, handling the main routing logic and
application structure. It uses Chakra UI for styling and React Router for navigation. The file sets
up the basic layout and routing infrastructure for the AI Coach application.

## Environment Configuration

```javascript
export const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://aicoachpro.ai';
```

This constant determines the API endpoint based on the development environment:

- Development: `http://localhost:3000`
- Production: `https://aicoachpro.ai`

## Main Components

### App Component

The primary component that wraps the entire application.

#### Dependencies

- `@chakra-ui/react`: UI component library
- `react-router-dom`: Routing functionality
- Local components: `Training`, `Landing`

#### Structure

```jsx
<ChakraProvider>
    <Router>
        <Routes>{/* Route definitions */}</Routes>
    </Router>
</ChakraProvider>
```

#### Routes

- `/`: Landing page
- `/app`: Training interface
- `/profile`: User profile page
- `/club`: Club management interface
- `/analytics`: Analytics dashboard

### Secondary Components

#### Profile

A placeholder component for user profile functionality.

```jsx
const Profile = () => (
    <Box w="full" p={8}>
        {/* Profile implementation */}
    </Box>
);
```

#### ClubManagement

A placeholder component for club management functionality.

```jsx
const ClubManagement = () => (
    <Box w="full" p={8}>
        {/* Club Management implementation */}
    </Box>
);
```

#### Analytics

A placeholder component for analytics functionality.

```jsx
const Analytics = () => (
    <Box w="full" p={8}>
        {/* Analytics implementation */}
    </Box>
);
```

## Commented Authentication Logic

The file includes commented-out authentication logic that could be implemented for user session
management:

```javascript
// const [isAuthenticated, setIsAuthenticated] = useState(false);
// const [userProfile, setUserProfile] = useState(null);
```

This would include:

- Authentication state management
- User profile data handling
- API authentication checks

## Integration with Project Structure

- Works alongside `Landing.jsx` and `Training.jsx` for main application views
- Part of the frontend architecture defined in the `src` directory
- Connects with the server-side implementation in the `server` directory
- Supports the overall application flow described in `docs/app_description.txt`

## Usage Example

```jsx
import App from './App';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

## Future Considerations

1. Implementation of authentication logic
2. Development of complete profile management
3. Integration of club management features
4. Analytics dashboard implementation
5. Enhanced routing security

## Dependencies

- React
- React Router DOM
- Chakra UI
- Environment variables (via Vite)

## Related Files

- `Landing.jsx`: Landing page implementation
- `Training.jsx`: Training interface
- `main.jsx`: Application entry point
- `schema.json`: Data schema definitions

---

This documentation provides a comprehensive overview of the `App.jsx` file and its role in the AI
Coach application. For specific implementation details of individual routes or components, refer to
their respective component files.
