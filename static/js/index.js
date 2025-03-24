// static/js/game.js

document.addEventListener('DOMContentLoaded', function() {
    const socket = io();
    // Get game_id from URL like "/join_game/ABC123"
    const pathSegments = window.location.pathname.split('/');
    const gameId = pathSegments[pathSegments.length - 1];

    console.log("Game ID:", gameId);  // "ABC123"
    const playerName = Math.floor(Math.random() * 100)

    document.getElementById('game-id-display').textContent = gameId;
    document.getElementById('player-name-display').textContent = playerName; 

    socket.on('connect', () => {
        // const playerName = prompt("Enter your name:");
        socket.emit('join', { "game_id": gameId, "player": playerName });
    });
    
    socket.on('game_update', (gameState) => {
        // Update UI based on game state
        console.log(gameState);
        updateGameUI(gameState);
    });
    
    // Add event listeners
    document.getElementById('bet-btn').addEventListener('click', () => {
        const amount = parseInt(document.getElementById('bet-amount').value);
        console.log(playerName)
        socket.emit('bet', { "game_id": gameId, "amount": amount, "player": playerName});
    });
    
    function updateGameUI(gameState) {
        // Your UI update logic here
    }
});