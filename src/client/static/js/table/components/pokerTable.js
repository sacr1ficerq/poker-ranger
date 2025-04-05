const Action = {
    BET: 'bet',
    CALL: 'call',
    RAISE: 'raise',
    FOLD: 'fold',
    CHECK: 'check'
}

const noms = "23456789TJQKA";
const suits = {
    'h': '♥',
    'd': '♦',
    's': '♠',
    'c': '♣'
};

const card = {
    view: function(vnode) {
        const c = vnode.attrs.card;
        if (c == undefined || c === '' || c.length == 1) {
            return m('div', {class: 'player-card'});
        }
        console.assert(c.length == 2);
        const nom = c[0];
        const suit = c[1];

        const content = nom + suits[suit] || '';
        const black = suit == 'c' || suit == 's';
        return m('div', {class: `player-card ${black? 'text-black' : 'text-red-500'}`}, content)
    }
}

export const hero = {
    view: function(vnode) {
        const heroName = vnode.attrs.heroName;
        console.assert(heroName != undefined, 'heroName expected');

        const hero = vnode.attrs.hero;
        console.assert(hero != undefined, 'hero expected');
        return m('#hero', {class: 'player-area absolute -bottom-16 center-x text-center'}, [
            m('div', {class: 'bg-white rounded-lg p-3 shadow-md'}, [
                m('#hero-name', {class: 'text-xs text-gray-600'}, heroName),
                m('div', {class: 'flex space-x-2 mt-1'}, [
                    m(card, {card: hero.cards[0]}),
                    m(card, {card: hero.cards[1]})
                ]),
                m('#hero-stack', {class: 'text-xs text-gray-600'}, hero.stack)
            ])
        ])
    }
}

export const villain = {
    view: function(vnode) {
        const villainName = vnode.attrs.villainName;
        console.assert(villainName != undefined, 'villainName expected');

        const villain = vnode.attrs.villain;
        console.assert(villain != undefined, 'villain expected');
        return m('#villain', {class: 'player-area absolute -top-16 center-x text-center'}, [
            m('div', {class: 'bg-white rounded-lg p-3 shadow-md'}, [
                m('#villain-name', {class: 'text-xs text-gray-600'}, villainName),
                m('div', {class: 'flex space-x-2 mt-1'}, [
                    m(card, {card: villain.cards[0]}),
                    m(card, {card: villain.cards[1]})
                ]),
                m('#villain-stack', {class: 'text-xs text-gray-600'}, villain.stack)
            ])
        ])
    }
}

export const pokerTable = {
    view: function(vnode) {
        const gameState = vnode.attrs.gameState;
        console.assert(gameState, 'gameState expected');
        console.assert(gameState.villain.bet != undefined, 'gameState.villain.bet expected');
        console.assert(gameState.hero.bet != undefined, 'gameState.hero.bet expected');
        console.assert(gameState.pot != undefined, 'gameState.pot expected');
        console.assert(gameState.board != undefined, 'gameState.board expected');

        return m('div', {class: 'poker-table'}, [
            m('div#villain-bet', {class: 'bet-placed-villain'}, gameState.villain.bet),
            m('#community-cards', {class: 'board'}, gameState.board.map(
                (c) => m(card, {card: c})
            )),
            m('div#pot-display', {class: 'pot mt-8'}, 'Pot: ' + gameState.pot),
            m('div#dealer-button', {class: 'dealer-button'}, 'D'), // TODO move dealer
            m('div#hero-bet', {class: 'bet-placed-hero'}, gameState.hero.bet)
        ])
    }
}

export const actions = {
    oninit(vnode) {
        this.state = vnode.attrs.state;
        console.assert(this.state, 'state expected');
        this.socket = vnode.attrs.socket;
        console.assert(this.socket, 'socket expected');
    },
    act: function(action, amount = 0.0) {
        const req = { 
            tableId: this.state.tableId, 
            amount: amount, 
            heroName: this.state.heroName, 
            action: action
        };
        this.socket.emit('action', req);
    },
    validateBetAmount: function(amount, gameState) {
        console.assert(gameState.minBet != undefined, 'gameState.minBet expected');
        console.assert(gameState.maxBet != undefined, 'gameState.maxBet expected');
        const betBtn = document.getElementById('bet-btn');
        const raiseBtn = document.getElementById('raise-btn');
        console.assert(betBtn, 'no bet-btn element');
        console.assert(raiseBtn, 'no raise-btn element');

        if (amount < gameState.minBet || amount > gameState.maxBet) {
            betBtn.classList.add('disabled');
            raiseBtn.classList.add('disabled');
        } else {
            betBtn.classList.remove('disabled');
            raiseBtn.classList.remove('disabled');
        }
    },
    getBetAmount: function() {
        const betAmount = document.getElementById('bet-amount');
        console.assert(betAmount != undefined, 'no bet-amount elment');
        return parseFloat(betAmount.value);
    },
    view: function(vnode) {
        const gameState = vnode.attrs.gameState;
        console.assert(gameState, 'gameState expected');

        const raisable = gameState.maxBet != 0;

        return m('#actions', [
            m('button#btn-fold', {onclick: () => this.act(Action.FOLD)}, 'Fold'),
            m('button#btn-check', {onclick: () => this.act(Action.CHECK)}, 'Check'),
            m('button#btn-call', {class: 'hidden', onclick: () => this.act(Action.CALL)}, 'Call'),
            m('div', {class: 'flex space-x-2'}, [
                m('input#bet-amount', {
                    type: 'number',
                    placeholder: 'Amount',
                    oninput: (e) => this.validateBetAmount(e.target.value, gameState)
                }),
                raisable? 
                    m('button#btn-raise', {onclick: () => {this.act(Action.RAISE, this.getBetAmount());}}, 'Raise') :
                    m('button#btn-bet', {onclick: () => {this.act(Action.BET, this.getBetAmount())}}, 'Bet')
            ])
        ])
    }
}

export const startGame = {
    view: function(vnode) {
        const state = vnode.attrs.state;
        console.assert(state, 'state expected');

        const socket = vnode.attrs.socket;
        console.assert(socket, 'socket expected');

        console.assert(state.tableId, 'state.tableId expected');
        console.assert(state.heroName, 'state.heroName expected');

        const canStart = state.canStart;

        return m('div', {class: 'flex justify-center mt-24'}, [
            m('button#start-table', {
                class: `btn-primary medium ${canStart? '': 'disabled'}`,
                onclick: () => {
                    if (state.canStart) {
                        socket.emit('startTable', {
                            tableId: state.tableId,
                            heroName: state.heroName
                        });
                        state.gameStarted = true;
                    }
                }
            }, 'Start table')
        ])
    }
}
