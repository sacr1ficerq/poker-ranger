function update_hero(elements, hero, state, round) {
    elements.hero_stack.textContent = hero.stack;
    elements.hero_bet.textContent = hero.bet;
    const acting = round.acting === state.hero_name;
    elements.hero.classList.toggle('acting', acting);
    elements.actions.classList.toggle('hidden', !acting);

    
    if (acting) {
        var raisable = round.max_bet != 0;
        elements.bet_btn.classList.toggle('hidden', raisable);
        elements.raise_btn.classList.toggle('hidden', !raisable);

        elements.check_btn.classList.toggle('hidden', raisable);
        elements.call_btn.classList.toggle('hidden', !raisable);

        elements.bet_amount.value = '';
        elements.bet_btn.classList.toggle('disabled', true);
        elements.raise_btn.classList.toggle('disabled', true);
    
        const step = round.max_bet - hero.bet;
        const bb = 2;   // TODO
        state.min_bet = round.max_bet + Math.min(step, bb);
        state.max_bet = hero.stack - round.max_bet;
    } 
}

function update_villain(elements, villain, state, round) {
    elements.villain_stack.textContent = villain.stack;
    elements.villain_bet.textContent = villain.bet;
    // elements.villain.classList.toggle('folded', villain.folded);
    elements.villain.classList.toggle('acting', round.acting == state.villain_name);
}

function update_board(elements, board) {
    elements.community_cards.innerHTML = board
        .map(card => `<div class="community-card">${card}</div>`)
        .join('');
}

export function update_cards(elements, cards) {
    const noms = "23456789TJQKA";
    const suits = {
        'h': '♥',
        'd': '♦',
        's': '♠',
        'c': '♣'
    };
    cards = cards.sort((a, b) => noms.indexOf(b[0]) - noms.indexOf(a[0]))
    elements.hero.querySelectorAll('.player-card').forEach((card, i) => {
        const nom = cards[i][0];
        const suit = cards[i][1];
        card.textContent = nom + suits[suit] || '';
        if (suit === 'c' || suit === 's') {
            card.classList.add('text-black-500');
        } else {
            card.classList.add('text-red-500');
        }
    });
}

export function update_table(elements, game_state, state) {
    console.log('Updating table UI...');
    console.log('table state:', game_state);

    const hero = game_state.players.find(p => p.name === state.hero_name);
    if (hero) {
        update_hero(elements, hero, state, game_state.round);
    } else {
        throw new ReferenceError('Hero is not defined');
    }

    const villain = game_state.players.find(p => p.name !== state.hero_name);
    if (villain) {
        update_villain(elements, villain, state, game_state.round);
    } else {
        throw new ReferenceError('Villain is not defined');
    }

    elements.pot_amount.textContent = game_state.round.pot;

    // Add board to game_state
    update_board(elements, game_state.round.board);
}

export function update_players(elements, players_state, state) {
    console.log('Updating players...')
    console.log('players:', players_state)
    if (players_state.length >= 2) {
        state.can_start = true;
        elements.start_table_btn.classList.remove('disabled');
    }
    players_state.forEach(player => {
        if (player.name === state.hero_name) {
            elements.hero_stack.textContent = player.stack;
            elements.hero_name.textContent = player.name;
        } else {
            elements.villain_stack.textContent = player.stack;
            elements.villain_name.textContent = player.name;
            state.villain_name = player.name;
        }
    });
}

