import { update_table, update_players, update_cards } from './game-ui.js';
import { elements } from './dom.js';

document.addEventListener('DOMContentLoaded', function() {
    const socket = io();

    const path_segments = window.location.pathname.split('/');
    const state = {
        table_id: path_segments[path_segments.length - 1],
        can_start: false,
        hero_name: 'Anonimous',
        villain_name: 'Anonimous'
    };

    // hide actions before game starts
    elements.actions.classList.add('hidden');
    elements.start_table_btn.classList.add('disabled');

    console.log("table ID:", state.table_id);

    elements.table_id.textContent = state.table_id;
    // elements.actions deactivate

    // Socket.IO Event Handlers
    socket.on('connect', () => {
        console.log('connected');
    });

    socket.on('game_start', () => {
        console.log('game startes');
        elements.start_table_btn.classList.add('hidden');
        elements.actions.classList.remove('hidden');
    });
    
    socket.on('table_update', (table_state) => {
        console.log(table_state);
        update_table(elements, table_state, state);
    });

    socket.on('private_update', (private_state) => {
        console.log(private_state);
        update_cards(elements, private_state['cards']);
    });


    socket.on('message', (message) => {
        console.log('message:', message);
    });

    socket.on('players_update', (player_states) => {
        console.log(player_states);
        update_players(elements, player_states, state);
    });
    
    // Add event listeners
    // TODO: press buttons with keyboard

    elements.username_form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = elements.username_input.value.trim();
        if (username) {
            state.hero_name = username;
            elements.username_modal.classList.add('hidden');
        }
        socket.emit('join', { "table_id": state.table_id, "hero_name": state.hero_name });
    });


    elements.bet_btn.addEventListener('click', () => {
        const amount = parseFloat(elements.bet_amount.value);
        console.log(state.hero_name)
        console.log("Hero bets: ", amount)
        socket.emit('bet', { "table_id": state.table_id, "amount": amount, "hero_name": state.hero_name});
    });

    
    elements.start_table_btn.addEventListener('click', () => {
        if (!state.can_start) {
            console.log('cant start')
            return;
        }
        console.log("table starts")

        socket.emit('start_table', {'table_id': state.table_id, 'hero_name': state.hero_name})
    });
});
