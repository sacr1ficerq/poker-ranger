import { get_elements } from './dom.js';
import { handle } from './socketio.js';

document.addEventListener('DOMContentLoaded', function() {
    const elements = get_elements(document);
    console.log(elements);
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
    
    const socket = io();
    handle(socket, state, elements);
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
