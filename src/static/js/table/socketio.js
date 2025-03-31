import { update_table, update_players, update_cards } from './ui.js';

export function handle(socket, state, elements){
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
}
