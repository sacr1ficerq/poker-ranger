document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        table_id: document.getElementById('table-id-display'),
        player_name: document.getElementById('player-name-display'),

        hero: document.getElementById('hero'),
        villain: document.getElementById('villain'),

        hero_stack: document.getElementById('hero-stack'),
        villain_stack: document.getElementById('villain-stack'),

        hero_name: document.getElementById('hero-name'),
        villain_name: document.getElementById('villain-name'),

        start_table_btn: document.getElementById('start-table'),

        actions: document.getElementById('actions'),
        community_cards: document.getElementById('community-cards'),
    
        bet_btn: document.getElementById('bet-btn'),
        bet_amount: document.getElementById('bet-amount'),

        username_modal: document.getElementById('username-modal'),
        username_form: document.getElementById('username-form'),
        username_input: document.getElementById('username'),

    };

    const socket = io();
    const path_segments = window.location.pathname.split('/');
    const table_id = path_segments[path_segments.length - 1];

    // hide actions before game starts
    elements.actions.classList.add('hidden');
    elements.start_table_btn.classList.add('hidden');

    console.log("table ID:", table_id);
    let player_name = 'Anonimous'

    elements.table_id.textContent = table_id;
    // elements.actions deactivate

    // Socket.IO Event Handlers
    socket.on('connect', () => {
        console.log('connected');
    });
    
    socket.on('table_update', (table_state) => {
        console.log(table_state);
        update_table_ui(table_state);
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
        socket.emit('join', { "table_id": table_id, "player_name": player_name });
    });


    elements.bet_btn.addEventListener('click', () => {
        const amount = parseInt(elements.bet_amount.value);
        console.log(player_name)
        console.log("Hero bets: ", amount)
        socket.emit('bet', { "table_id": table_id, "amount": amount, "player_name": player_name});
    });

    
    elements.start_table_btn.addEventListener('click', () => {
        console.log("table starts")
        socket.emit('start_table', {'table_id': table_id, 'player_name': player_name})
    });
    
    function update_table_ui(table_state) {
        console.log('Updating table UI...')
        console.log('table state:', table_state)
        // Your UI update logic here
        // Inside update_table_ui()

        // Inside update_table_ui()
        const hero = table_state.players.find(p => p.name === player_name);
        if (hero) {
            // Update hero's cards
            elements.hero_stack.textContent = hero.stack;
            elements.hero.querySelectorAll('.player-card').forEach((card, i) => {
                card.textContent = hero.cards[i] || '';
            });
            // Highlight if acting
            elements.hero.classList.toggle('acting', hero.is_acting);
        }

        const villain = table_state.players.find(p => p.name !== player_name);
        if (villain) {
          // Hide villain's cards (only show count if all-in)
          elements.villain_stack.textContent = villain.stack;
          elements.villain.querySelector('.player-card').textContent = 
            villain.all_in ? 'ALL IN' : '';
          elements.villain.classList.toggle('folded', villain.folded);
        }

        // Inside update_table_ui()
        document.getElementById('pot-amount').textContent = table_state.round.pot;
        // Disable buttons if not your turn
        elements.actions.classList.toggle('opacity-50', !hero?.is_acting);
        
        return
        // Add board to table_state
        community_cards.innerHTML = table_state.round.board
        .map(card => `<div class="community-card">${card}</div>`)
        .join('');
    }

    function update_players(players_state) {
        console.log('Updating players...')
        console.log('players:', players_state)
        if (players_state.length >= 2) {
            elements.start_table_btn.classList.remove('hidden');
        }
        players_state.forEach(player => {
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