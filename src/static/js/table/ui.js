export function update_table(elements, table_state, state) {
    console.log('Updating table UI...');
    console.log('table state:', table_state);
    const round = table_state["round"];

    const hero = table_state.players.find(p => p.name === state.hero_name);
    if (hero) {
        elements.hero_stack.textContent = hero.stack;
        elements.hero_bet.textContent = hero.bet;
        elements.hero.classList.toggle('acting', round['acting'] == state.hero_name);
    }

    const villain = table_state.players.find(p => p.name !== state.hero_name);
    if (villain) {
      elements.villain_stack.textContent = villain.stack;
      elements.villain_bet.textContent = villain.bet;

      elements.villain.classList.toggle('folded', villain.folded);
      elements.villain.classList.toggle('acting', round['acting'] == state.villain_name);
    }
    
    elements.pot_amount.textContent = table_state.round.pot;
    // document.getElementById('pot-amount').textContent = table_state.round.pot;
    
    // Disable buttons if not your turn
    // elements.actions.classList.toggle('opacity-50', !hero?.is_acting);
    
    // Add board to table_state
    elements.community_cards.innerHTML = table_state.round.board
    .map(card => `<div class="community-card">${card}</div>`)
    .join('');
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

export function update_cards(elements, cards) {
    const s = "23456789TJQKA";
    const suits = {
        'h': '♥',
        'd': '♦',
        's': '♠',
        'c': '♣'
    };
    cards = cards.sort((a, b) => s.indexOf(b[0]) - s.indexOf(a[0]))
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
