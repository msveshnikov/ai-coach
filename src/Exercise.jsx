import { useRef, useEffect } from 'react';

const Exercise = ({ exercise }) => {
    const canvasRef = useRef(null);
    const padding = 40;

    useEffect(() => {
        if (!canvasRef.current || !exercise) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const drawField = () => {
            ctx.fillStyle = '#90EE90';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#98FB98';
            for (let i = 0; i < canvas.width; i += 100) {
                ctx.fillRect(i, 0, 50, canvas.height);
            }

            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                padding,
                padding,
                canvas.width - 2 * padding,
                canvas.height - 2 * padding
            );
        };

        const drawPlayer = (x, y, team) => {
            ctx.font = '30px Arial';
            const emoji = team === 'team1' ? '🤾‍♂️' : '🤾‍♀️';
            ctx.fillText(emoji, x - 10, y + 10);
        };

        const drawCone = (x, y) => {
            ctx.beginPath();
            ctx.moveTo(x, y - 5);
            ctx.lineTo(x - 5, y + 5);
            ctx.lineTo(x + 5, y + 5);
            ctx.closePath();
            ctx.fillStyle = '#FFA500';
            ctx.fill();
        };

        const drawPath = (points) => {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.strokeStyle = '#FFFFFF';
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        };

        const render = () => {
            drawField();

            const scaleX = (canvas.width - 2 * padding) / exercise.field.width;
            const scaleY = (canvas.height - 2 * padding) / exercise.field.height;

            exercise.elements.forEach((element) => {
                const x = padding + element.position.x * scaleX;
                const y = padding + element.position.y * scaleY;

                switch (element.type) {
                    case 'player':
                        drawPlayer(x, y, element.team);
                        break;
                    case 'cone':
                        drawCone(x, y);
                        break;
                    case 'path':
                        if (element.path) {
                            const scaledPath = element.path.map((point) => ({
                                x: padding + point.x * scaleX,
                                y: padding + point.y * scaleY
                            }));
                            drawPath(scaledPath);
                        }
                        break;
                }
            });
        };

        render();
    }, [exercise]);

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{ maxWidth: '100%', height: 'auto' }}
        />
    );
};

export default Exercise;
