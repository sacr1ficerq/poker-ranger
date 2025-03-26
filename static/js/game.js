document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        game_id: document.getElementById('game-id-display'),
        player_name: document.getElementById('player-name-display'),

        hero: document.getElementById('hero'),
        villain: document.getElementById('villain'),

        hero_stack: document.getElementById('hero-stack'),
        villain_stack: document.getElementById('villain-stack'),

        hero_name: document.getElementById('hero-name'),
        villain_name: document.getElementById('villain-name'),

        actions: document.getElementById('actions'),
    
        bet_btn: document.getElementById('bet-btn'),
        bet_amount: document.getElementById('bet-amount'),

        username_modal: document.getElementById('username-modal'),
        username_form: document.getElementById('username-form'),
        username_input: document.getElementById('username'),

    };

    const socket = io();
    const path_segments = window.location.pathname.split('/');
    const game_id = path_segments[path_segments.length - 1];

    // hide actions before game starts
    elements.actions.classList.add('hidden');

    console.log("Game ID:", game_id);
    let player_name = 'Anonimous'

    elements.game_id.textContent = game_id;
    // elements.actions deactivate

    // Socket.IO Event Handlers
    socket.on('connect', () => {
        console.log('connected')
    });
    
    socket.on('game_update', (game_state) => {
        console.log(game_state);
        update_game_ui(game_state);
    });


    socket.on('message', (message) => {
        console.log('message:', message);
    });

    socket.on('players_update', (player_states) => {
        console.log(player_states);
        update_players(player_states);
    });
    
    // Add event listeners
    // TODO: press buttons with keyboard

    elements.username_form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = elements.username_input.value.trim();
        if (username) {
            player_name = username;
            elements.username_modal.classList.add('hidden');
        }
        socket.emit('join', { "game_id": game_id, "player_name": player_name });
    });


    elements.bet_btn.addEventListener('click', () => {
        const amount = parseInt(elements.bet_amount.value);
        console.log(player_name)
        console.log("Hero bets: ", amount)
        socket.emit('bet', { "game_id": game_id, "amount": amount, "player_name": player_name});
    });
    
    function update_game_ui(game_state) {
        console.log('Updating game UI...')
        console.log('game state:', game_state)
        // Your UI update logic here
    }

    function update_players(players_state) {
        console.log('Updating players...')
        console.log('players:', players_state)
        players_state.forEach(player => {
            // Find opponent (assuming player_name is your client's name)
            if (player.name === player_name) {
              elements.hero_stack.textContent = player.stack;
              elements.hero_name.textContent = player.name;
            } else {
              elements.villain_stack.textContent = player.stack;
              elements.villain_name.textContent = player.name;
            }
        });
    }

});