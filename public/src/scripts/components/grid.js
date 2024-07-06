// public/src/scripts/components/grid.js

export function drawGrid(ctx, gridSize) {
    ctx.strokeStyle = '#000000'; // Set grid line color
    ctx.lineWidth = 1; // Set grid line width

    for (let x = 0; x <= ctx.canvas.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ctx.canvas.height);
    }

    for (let y = 0; y <= ctx.canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(ctx.canvas.width, y);
    }

    ctx.stroke();
}