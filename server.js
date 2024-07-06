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
const gridSize = 20; // Grid size in pixels
const gridWidth = 25; // Number of grid cells in width
const gridHeight = 25; // Number of grid cells in height
const colors = ['red', 'blue', 'green', 'yellow', 'purple']; // Sample colors for players

io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    // Assign a random color to the new player
    const color = colors[Math.floor(Math.random() * colors.length)];
    players[socket.id] = new Player(socket.id, 0, 0, color);

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        delete players[socket.id];
        io.emit('state', players);
    });

    socket.on('move', (direction) => {
        const player = players[socket.id];
        if (!player) return;

        player.move(direction, gridSize, gridWidth, gridHeight);
        io.emit('state', players);
    });

    // Emit the initial state to the new player
    io.emit('state', players);
});

app.use(express.static('public'));

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});