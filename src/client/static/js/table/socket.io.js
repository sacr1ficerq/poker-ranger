export function handle(socket, pokerTable) {
    socket.on('connect', () => {
        console.log('Connected')
        socket.emit('requestNames', pokerTable.state);
    });

    socket.on('updateNames', (data) => {
        console.log('Players names: ', data.players)
        pokerTable.updateNames(data.players);
    });

    socket.on('gameStart', () => {
        console.log('Game startes');
        pokerTable.startGame();
    });

    socket.on('newRound', () => {
        console.log('New round');
        pokerTable.newRound();
    });
    
    socket.on('tableUpdate', (tableState) => {
        console.log('Table update:');
        console.log(tableState);
        pokerTable.update(tableState);
    });

    socket.on('privateUpdate', (privateState) => {
        console.log('Private update:');
        console.log(privateState);
        pokerTable.updatePrivate(privateState);
    });

    socket.on('playersUpdate', (playersState) => {
        console.log('Players update:');
        console.log(playersState);
        pokerTable.updatePlayers(playersState);
    });

    socket.on('message', (message) => {
        console.log('Message:', message);
        pokerTable.message(message);
    });

}
