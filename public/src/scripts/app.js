// public/src/scripts/app.js

import { drawGrid } from './components/grid.js';
import { Player } from './components/player.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const socket = io(); // Use the global `io` object

const gridSize = 10; // Adjust the grid size as needed

let players = {};

let numberToColor = {
    '0': 'clear',
    '1': '#c1d11f',
    '2': '#34a203',
    '3': '#00610e',
    '4': '#A7E6FF',
    '5': '#3572EF',
    '6': '#050C9C',
    '7': '#563232',
    '8': '#ffc18c',
    '9': '#da6d42'
};

let fieldState = {};




// Draw the grid
drawGrid(ctx, gridSize);


function drawField(ctx, gridSize) {
    // iterate over fieldState keys
    Object.keys(fieldState).forEach(x => {
        Object.keys(fieldState[x]).forEach(y => {
            ctx.fillStyle = fieldState[x][y];
            ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
        });
    });
}

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
    drawField(ctx, gridSize);
    drawPlayers();
}

// Handle state updates from the server
socket.on('state', (gameState) => {
    players = gameState["players"];
    fieldState = gameState["fieldState"];
    render();
});

// Example movement logic
document.addEventListener('keydown', (event) => {

    console.log("event.key: ", event.key); 

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

    const numberKeys = {
        '0': '0',
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',    
    };

    const number = numberKeys[event.key];
    if (number) {
        socket.emit('number', number);
    }

    if (event.key === ' ') {
        socket.emit('space');
    }


});