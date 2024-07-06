// public/src/scripts/components/player.js

export class Player {
    constructor(id, x, y, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw(ctx, gridSize) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * gridSize, this.y * gridSize, gridSize, gridSize);
    }

    move(direction, canvasWidth, canvasHeight, gridSize) {
        switch (direction) {
            case 'ArrowUp':
                if (this.y > 0) this.y--;
                break;
            case 'ArrowDown':
                if (this.y < canvasHeight / gridSize - 1) this.y++;
                break;
            case 'ArrowLeft':
                if (this.x > 0) this.x--;
                break;
            case 'ArrowRight':
                if (this.x < canvasWidth / gridSize - 1) this.x++;
                break;
        }
    }
}


// export function createPlayer(x, y) {
//     return { x, y };
// }

// export function drawPlayer(ctx, player, cellSize) {
//     ctx.fillStyle = '#ff0000';
//     ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
// }