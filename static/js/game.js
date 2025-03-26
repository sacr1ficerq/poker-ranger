document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        game_id: document.getElementById('game-id-display'),
        player_name: document.getElementById('player-name-display'),

        actions: document.getElementById('actions'),
    
        bet_btn: document.getElementById('bet-btn'),
        bet_amount: document.getElementById('bet-amount')

    };

    const socket = io();
    const path_segments = window.location.pathname.split('/');
    const game_id = path_segments[path_segments.length - 1];

    console.log("Game ID:", game_id);
    
    const player_name = Math.floor(Math.random() * 100) // TODO: get player name

    elements.game_id.textContent = game_id;
    elements.player_name.textContent = player_name; 
    // elements.actions deactivate

    // Socket.IO Event Handlers
    socket.on('connect', () => {
        socket.emit('join', { "game_id": game_id, "player_name": player_name });
    });
    
    socket.on('game_update', (game_state) => {
        // Update UI based on game state
        console.log(game_state);
        updateGameUI(game_state);
    });
    
    // Add event listeners
    // TODO: press buttons with keyboard
    elements.bet_btn.addEventListener('click', () => {
        const amount = parseInt(elements.bet_amount.value);
        console.log(player_name)
        socket.emit('bet', { "game_id": game_id, "amount": amount, "player_name": player_name});
    });
    
    function updateGameUI(gameState) {
        // Your UI update logic here
    }
});