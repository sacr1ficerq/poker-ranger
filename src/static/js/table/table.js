import { get_elements } from './dom.js';
import { handle } from './socketio.js';


const Action = Object.freeze({
    BET: 'BET',
    CHECK: 'CHECK',
    CALL: 'CALL',
    FOLD: 'FOLD',
    RAISE: 'RAISE'
});


document.addEventListener('DOMContentLoaded', function() {
    const elements = get_elements(document);
    console.log(elements);
    const path_segments = window.location.pathname.split('/');
    const bb = 2;   // TODO
    const state = {
        table_id: path_segments[path_segments.length - 1],
        can_start: false,
        hero_name: 'Anonimous',
        villain_name: 'Anonimous',
        min_bet: bb
    };

    // hide actions before game starts
    elements.actions.classList.add('hidden');
    elements.start_table_btn.classList.add('disabled');

    elements.username_submit.classList.add('disabled');

    elements.table_id.textContent = state.table_id;
    
    const socket = io();
    handle(socket, state, elements);

    // Add event listeners
    elements.username_form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = elements.username_input.value.trim();
        if (username) {
            if (state.villain_name == username) {
                return;
            } else {
                state.hero_name = username;
                elements.username_modal.classList.add('hidden');
            }
        }
        socket.emit('join', { "table_id": state.table_id, "hero_name": state.hero_name });
    });

    elements.username_input.addEventListener('input', (e) => {
        const username = elements.username_input.value.trim();
        if (username) {
            if (state.villain_name === username) {
                elements.username_submit.classList.add('disabled');
            } else {
                elements.username_submit.classList.remove('disabled');
            }
        }
    });

    function act(state, action, amount=0.0) {
        // console.log([state.hero_name, action, amount].join(' '));
        const req = { "table_id": state.table_id, "amount": amount, "hero_name": state.hero_name, "action": action};
        console.log(req);
        socket.emit('action', req);
    }
    
    // TODO: press buttons with keyboard
    elements.bet_btn.addEventListener('click', () => {
        var amount = parseFloat(elements.bet_amount.value);
        amount = Math.round(amount * 100) / 100  // TODO: problem with all-ins
        act(state, Action.BET, amount - state.max_bet_placed);
    });

    elements.check_btn.addEventListener('click', () => {
        act(state, Action.CHECK);
    });

    elements.fold_btn.addEventListener('click', () => {
        act(state, Action.FOLD);
    });
    
    elements.call_btn.addEventListener('click', () => {
        act(state, Action.CALL);
    });

    elements.bet_amount.addEventListener('input', (e) => {
        var amount = parseFloat(elements.bet_amount.value);
        amount = Math.round(amount * 100) / 100

        if (amount) {
            if (amount < state.min_bet || amount > state.max_bet) {
                elements.bet_btn.classList.toggle('disabled', true);
                elements.raise_btn.classList.toggle('disabled', true);
            } else {
                elements.bet_btn.classList.toggle('disabled', false);
                elements.raise_btn.classList.toggle('disabled', false);
            }
        }
    });

    elements.raise_btn.addEventListener('click', () => {
        var amount = parseFloat(elements.bet_amount.value);
        amount = Math.round(amount * 100) / 100;
        console.log(state);
        act(state, Action.RAISE, amount - parseFloat(elements.hero_bet.textContent));
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
