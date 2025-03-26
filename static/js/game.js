document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    game_id_display = document.getElementById('game-id-display')
    player_name_display = document.getElementById('player-name-display')

    // Play buttons
    bet_btn = document.getElementById('bet-btn')
    bet_amount = document.getElementById('bet-amount')

    const socket = io();
    // Get game_id from URL like "/join_game/ABC123"
    const pathSegments = window.location.pathname.split('/');
    const gameId = pathSegments[pathSegments.length - 1];

    console.log("Game ID:", gameId);
    
    const playerName = Math.floor(Math.random() * 100) // TODO: get player name

    game_id_display.textContent = gameId;
    player_name_display.textContent = playerName; 


    // Socket.IO Event Handlers
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
    bet_btn.addEventListener('click', () => {
        const amount = parseInt(bet_amount.value);
        console.log(playerName)
        socket.emit('bet', { "game_id": gameId, "amount": amount, "player": playerName});
    });
    
    function updateGameUI(gameState) {
        // Your UI update logic here
    }
});