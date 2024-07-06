export function initControls(socket) {
    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                socket.emit('move', 'up');
                break;
            case 'ArrowDown':
                socket.emit('move', 'down');
                break;
            case 'ArrowLeft':
                socket.emit('move', 'left');
                break;
            case 'ArrowRight':
                socket.emit('move', 'right');
                break;
        }
    });
}