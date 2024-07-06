const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

class Player {
    constructor(id, x, y, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    move(direction, gridSize, gridWidth, gridHeight) {
        switch (direction) {
            case 'up':
                if (this.y > 0) this.y--;
                break;
            case 'down':
                if (this.y < gridHeight - 1) this.y++;
                break;
            case 'left':
                if (this.x > 0) this.x--;
                break;
            case 'right':
                if (this.x < gridWidth - 1) this.x++;
                break;
        }
    }
}

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

function changeFieldState(x, y, color) {
    if (color == 'clear') {
        if (fieldState[x] && fieldState[x][y]) {
            delete fieldState[x][y];
        }
        return;
    }

    if (!fieldState[x]) {
        fieldState[x] = {};
    }
    fieldState[x][y] = color;
};


let gameState = {
    "players": players,
    "fieldState": fieldState
};


function updateGameState() {
    gameState = {
        "players": players,
        "fieldState": fieldState
    };
}


const gridSize = 10; // Grid size in pixels
const gridWidth = 70; // Number of grid cells in width
const gridHeight = 70; // Number of grid cells in height
const colors = ['red', 'blue', 'green', 'yellow', 'purple']; // Sample colors for players

io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    // Assign a random color to the new player
    const color = colors[Math.floor(Math.random() * colors.length)];
    players[socket.id] = new Player(socket.id, 0, 0, color);

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        delete players[socket.id];
        
        updateGameState();

        io.emit('state', gameState);
    });

    socket.on('move', (direction) => {
        const player = players[socket.id];
        if (!player) return;

        player.move(direction, gridSize, gridWidth, gridHeight);

        updateGameState();

        io.emit('state', gameState);
    });

    socket.on('number', (number) => {
        const player = players[socket.id];
        if (!player) return;

        console.log(`Player ${socket.id} pressed number ${number}`);

        changeFieldState(player.x, player.y, numberToColor[number]);

        updateGameState();

        io.emit('state', gameState);
    });

    // Emit the initial state to the new player
    updateGameState();

    io.emit('state', gameState);
});

app.use(express.static('public'));

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});