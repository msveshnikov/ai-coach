const { createCanvas } = require('canvas');
const fs = require('fs');

class ExerciseRenderer {
  constructor(width = 800, height = 600) {
    this.canvas = createCanvas(width, height);
    this.ctx = this.canvas.getContext('2d');
    this.padding = 40;
  }

  drawField(exercise) {
    // Clear canvas
    this.ctx.fillStyle = '#90EE90'; // Light green
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw field stripes
    this.ctx.fillStyle = '#98FB98'; // Lighter green
    for (let i = 0; i < this.canvas.width; i += 100) {
      this.ctx.fillRect(i, 0, 50, this.canvas.height);
    }

    // Draw field border
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      this.padding,
      this.padding,
      this.canvas.width - (2 * this.padding),
      this.canvas.height - (2 * this.padding)
    );
  }

  drawPlayer(x, y, team) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, 10, 0, Math.PI * 2);
    this.ctx.fillStyle = team === 'team1' ? '#FF0000' : '#0000FF';
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawCone(x, y) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - 5);
    this.ctx.lineTo(x - 5, y + 5);
    this.ctx.lineTo(x + 5, y + 5);
    this.ctx.closePath();
    this.ctx.fillStyle = '#FFA500';
    this.ctx.fill();
  }

  drawPath(points) {
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.setLineDash([5, 5]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  render(exercise) {
    this.drawField(exercise);

    // Scale coordinates from meters to pixels
    const scaleX = (this.canvas.width - (2 * this.padding)) / exercise.field.width;
    const scaleY = (this.canvas.height - (2 * this.padding)) / exercise.field.height;

    exercise.elements.forEach(element => {
      const x = this.padding + (element.position.x * scaleX);
      const y = this.padding + (element.position.y * scaleY);

      switch (element.type) {
        case 'player':
          this.drawPlayer(x, y, element.team);
          break;
        case 'cone':
          this.drawCone(x, y);
          break;
        case 'path':
          if (element.path) {
            const scaledPath = element.path.map(point => ({
              x: this.padding + (point.x * scaleX),
              y: this.padding + (point.y * scaleY)
            }));
            this.drawPath(scaledPath);
          }
          break;
      }
    });
  }

  saveToFile(filename) {
    const buffer = this.canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
  }
}

// Example usage:
const exercise = {
  "title": "Fantasiegeschichte",
  "field": {
    "width": 12,
    "height": 12
  },
  "elements": [
    {
      "type": "player",
      "position": { "x": 3, "y": 3 },
      "team": "team1"
    },
    {
      "type": "player",
      "position": { "x": 9, "y": 3 },
      "team": "team2"
    },
    {
      "type": "cone",
      "position": { "x": 6, "y": 6 }
    },
    {
      "type": "path",
      "position": { "x": 3, "y": 3 },
      "path": [
        { "x": 3, "y": 3 },
        { "x": 6, "y": 6 },
        { "x": 9, "y": 3 }
      ]
    }
  ],
  "description": "Die Kinder sind als Abenteurer im Urwald unterwegs.",
  "organization": [
    "Ein 12 x 12 Meter großes Feld markieren.",
    "Im Feld mehrere Hütchen gemäß Abbildung aufstellen.",
    "Die Gruppe in Abenteurer und Urwaldaffen aufteilen."
  ]
};

const renderer = new ExerciseRenderer();
renderer.render(exercise);
renderer.saveToFile('exercise.png');