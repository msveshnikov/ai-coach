import { useRef, useEffect } from 'react';

const Diagram = ({ diagram }) => {
    const canvasRef = useRef(null);
    const padding = 40;

    useEffect(() => {
        if (!canvasRef.current || !diagram) return;

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

        const drawShootPass = (points) => {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.stroke();
            drawArrowhead(points[points.length - 1].x, points[points.length - 1].y, 0);
        };

        const drawRun = (points) => {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.strokeStyle = '#FFFFFF';
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
            drawArrowhead(points[points.length - 1].x, points[points.length - 1].y, 0);
        };

        const drawDribble = (points) => {
            ctx.beginPath();
            let x = points[0].x;
            let y = points[0].y;
            ctx.moveTo(x, y);
            for (let i = 1; i < points.length; i++) {
                const cp1x = (x + points[i].x) / 2;
                const cp1y = y + 10;
                const cp2x = (x + points[i].x) / 2;
                const cp2y = points[i].y - 10;
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, points[i].x, points[i].y);
                x = points[i].x;
                y = points[i].y;
            }
            ctx.strokeStyle = '#FFFFFF';
            ctx.stroke();
            drawArrowhead(points[points.length - 1].x, points[points.length - 1].y, 0);
        };

        const drawCross = (points) => {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            const cp1x = points[0].x + (points[1].x - points[0].x) / 2;
            const cp1y = points[0].y - 30;
            ctx.quadraticCurveTo(cp1x, cp1y, points[1].x, points[1].y);
            ctx.strokeStyle = '#FFFFFF';
            ctx.stroke();
            drawArrowhead(points[1].x, points[1].y, Math.PI / 4);
        };

        const drawZone = (x, y, width, height) => {
            ctx.strokeStyle = '#FFFFFF';
            ctx.strokeRect(x, y, width, height);
            const dotSize = 4;
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.arc(x + width, y, dotSize, 0, Math.PI * 2);
            ctx.arc(x, y + height, dotSize, 0, Math.PI * 2);
            ctx.arc(x + width, y + height, dotSize, 0, Math.PI * 2);
            ctx.fill();
        };

        const drawArrowhead = (x, y, angle) => {
            const headLength = 10;
            const headAngle = Math.PI / 6;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(
                x - headLength * Math.cos(angle - headAngle),
                y - headLength * Math.sin(angle - headAngle)
            );
            ctx.moveTo(x, y);
            ctx.lineTo(
                x - headLength * Math.cos(angle + headAngle),
                y - headLength * Math.sin(angle + headAngle)
            );
            ctx.stroke();
        };

        const render = () => {
            drawField();

            const scaleX = (canvas.width - 2 * padding) / (diagram.field?.width ?? 1);
            const scaleY = (canvas.height - 2 * padding) / (diagram.field?.height ?? 1);

            diagram.elements?.forEach((element) => {
                const x = padding + (element.position?.x ?? 0) * scaleX;
                const y = padding + (element.position?.y ?? 0) * scaleY;

                switch (element.type) {
                    case 'player':
                        drawPlayer(x, y, element.team);
                        break;
                    case 'cone':
                        drawCone(x, y);
                        break;
                    case 'shoot':
                        drawShootPass(
                            element.path.map((p) => ({
                                x: padding + p.x * scaleX,
                                y: padding + p.y * scaleY
                            }))
                        );
                        break;
                    case 'run':
                        drawRun(
                            element.path.map((p) => ({
                                x: padding + p.x * scaleX,
                                y: padding + p.y * scaleY
                            }))
                        );
                        break;
                    case 'dribble':
                        drawDribble(
                            element.path.map((p) => ({
                                x: padding + p.x * scaleX,
                                y: padding + p.y * scaleY
                            }))
                        );
                        break;
                    case 'cross':
                        drawCross(
                            element.path.map((p) => ({
                                x: padding + p.x * scaleX,
                                y: padding + p.y * scaleY
                            }))
                        );
                        break;
                    case 'zone':
                        drawZone(
                            padding + element.position?.x * scaleX,
                            padding + element.position?.y * scaleY,
                            element.width * scaleX,
                            element.height * scaleY
                        );
                        break;
                }
            });
        };

        render();
    }, [diagram]);

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{ maxWidth: '100%', height: 'auto' }}
        />
    );
};

export default Diagram;
