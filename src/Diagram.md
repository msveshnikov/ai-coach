# Diagram Component Documentation

## Overview

The `Diagram` component is a React component that renders interactive handball exercise diagrams
using HTML5 Canvas. It visualizes players, cones, and movement paths on a field-like background.
This component is part of a larger application that appears to be focused on handball training or
exercise visualization.

## Component Location

`src/Diagram.jsx`

## Dependencies

- React
- `useRef` and `useEffect` hooks from React

## Props

| Prop     | Type   | Description                                                                       |
| -------- | ------ | --------------------------------------------------------------------------------- |
| exercise | Object | Contains exercise configuration including field dimensions and elements to render |

### Exercise Object Structure

```javascript
{
  field: {
    width: number,
    height: number
  },
  elements: [
    {
      type: 'player' | 'cone' | 'path',
      position: { x: number, y: number },
      team?: 'team1' | 'team2',
      path?: Array<{ x: number, y: number }>
    }
  ]
}
```

## Internal Constants

- `padding`: Fixed value of 40 pixels used for field margins

## Canvas Drawing Functions

### drawField()

Renders the background field with alternating stripes and white border.

- Colors:
    - Base: `#90EE90` (Light green)
    - Stripes: `#98FB98` (Pale green)
    - Border: `#FFFFFF` (White)

### drawPlayer(x, y, team)

Renders a player emoji at specified coordinates.

- Parameters:
    - `x`: X-coordinate
    - `y`: Y-coordinate
    - `team`: Team identifier ('team1' or 'team2')
- Visuals:
    - Team 1: 🤾‍♂️
    - Team 2: 🤾‍♀️

### drawCone(x, y)

Renders a triangular cone marker.

- Parameters:
    - `x`: X-coordinate
    - `y`: Y-coordinate
- Color: `#FFA500` (Orange)

### drawPath(points)

Renders a dashed line connecting multiple points.

- Parameters:
    - `points`: Array of {x, y} coordinates
- Style: White dashed line (5px dash, 5px gap)

### render()

Main rendering function that:

1. Clears and draws the field
2. Scales elements based on field dimensions
3. Renders all exercise elements (players, cones, paths)

## Usage Example

```jsx
const exerciseConfig = {
    field: {
        width: 40,
        height: 20
    },
    elements: [
        {
            type: 'player',
            position: { x: 10, y: 10 },
            team: 'team1'
        },
        {
            type: 'cone',
            position: { x: 20, y: 15 }
        },
        {
            type: 'path',
            path: [
                { x: 10, y: 10 },
                { x: 20, y: 15 }
            ]
        }
    ]
};

<Diagram diagram={diagramConfig} />;
```

## Canvas Properties

- Width: 800px
- Height: 600px
- Responsive scaling: Maintains aspect ratio with `maxWidth: '100%'`

## Implementation Notes

- Uses React's `useRef` to maintain a reference to the canvas element
- Implements `useEffect` to handle drawing operations when the exercise prop changes
- Automatically scales elements based on field dimensions
- Supports responsive layout while maintaining aspect ratio

## Integration

This component likely integrates with the main application (`App.jsx`) to visualize handball
exercises or drills. It's designed to be a reusable component that can render different exercise
configurations passed through props.

## Best Practices

- Clean up is handled implicitly as new renders clear the canvas
- Scaling is handled automatically based on field dimensions
- Responsive design considerations are implemented
- Clear separation of drawing concerns into distinct functions
