# Training Component Documentation

## Overview

The `Training.jsx` component is a core part of the AI Coach application, providing an interface for
users to generate customized football training sessions. It integrates with OpenAI's GPT-4 model to
create detailed training plans based on user-specified parameters.

## Component Structure

### File Location

`src/Training.jsx`

### Dependencies

- `@chakra-ui/react` - UI component library
- `@chakra-ui/icons` - Icon components
- `react-markdown` - Markdown rendering
- `Exercise.jsx` - Custom component for visualizing training exercises

## Key Features

- Form-based training configuration
- AI-powered training plan generation
- Interactive visualization of training exercises
- Dark/Light mode support
- Responsive design

## State Management

```javascript
const [trainingType, setTrainingType] = useState('exercise');
const [ageGroup, setAgeGroup] = useState('');
const [playerCount, setPlayerCount] = useState('');
const [performanceClass, setPerformanceClass] = useState('');
const [duration, setDuration] = useState('');
const [trainingAim, setTrainingAim] = useState('');
const [additionalInfo, setAdditionalInfo] = useState('');
const [generatedTraining, setGeneratedTraining] = useState('');
const [exerciseData, setExerciseData] = useState(exercise);
```

## Main Functions

### `generateTraining`

```javascript
const generateTraining = async () => {
    // Generates training plan using AI
    Parameters: None
    Returns: void
    Triggers API call to '/api/generate-training'
}
```

### `cleanGeneratedCode`

```javascript
function cleanGeneratedCode(code) {
    // Extracts JSON from code blocks
    Parameters:
        - code: string (Raw response from API)
    Returns: string | null (Cleaned JSON string)
}
```

## Component Sections

### Configuration Tab

- Training Type selection (Exercise/Session/Cyclus)
- Age Group dropdown
- Number of Players input
- Performance Class selection
- Duration input
- Training Aim selection
- Additional Information textarea

### Generated Training Tab

- Visual exercise diagram
- Markdown-rendered training plan

## Usage Example

```jsx
import Training from './Training';

function App() {
    return (
        <div>
            <Training />
        </div>
    );
}
```

## Exercise Schema

The component uses a standardized JSON schema for defining training exercises:

- Field dimensions
- Player positions
- Cone placements
- Movement paths

## API Integration

Makes POST requests to `${API_URL}/api/generate-training` with:

- Prompt template
- Training parameters
- Model specification (gpt-4)

## Error Handling

- Toast notifications for success/failure
- Loading states during API calls
- JSON parsing error handling

## Styling

- Uses Chakra UI theming
- Supports dark/light mode
- Responsive container layout
- Consistent spacing and typography

## Project Context

This component serves as the main training generation interface in the AI Coach application, working
alongside:

- `App.jsx` - Main application wrapper
- `Exercise.jsx` - Training visualization component
- `Landing.jsx` - Initial user interface

## Notes

- Requires API_URL environment variable
- Depends on Chakra UI theme configuration
- Assumes server-side endpoint availability
- Requires appropriate CORS configuration

## Future Improvements

- Add exercise template library
- Implement save/load functionality
- Add export options
- Enhance visualization capabilities
- Add real-time collaboration features
