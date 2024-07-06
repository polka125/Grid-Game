// public/src/scripts/app.js

import { drawGrid } from './components/grid.js';
import { Player } from './components/player.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const socket = io(); // Use the global `io` object

const gridSize = 20; // Adjust the grid size as needed
let players = {};

// Draw the grid
drawGrid(ctx, gridSize);

function drawPlayers() {
    Object.values(players).forEach(player => {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x * gridSize, player.y * gridSize, gridSize, gridSize);
    });
}

// Clear and redraw the grid and players
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, gridSize);
    drawPlayers();
}

// Handle state updates from the server
socket.on('state', (serverPlayers) => {
    players = serverPlayers;
    render();
});

// Example movement logic
document.addEventListener('keydown', (event) => {
    const directions = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right'
    };

    const direction = directions[event.key];
    if (direction) {
        socket.emit('move', direction);
    }
});