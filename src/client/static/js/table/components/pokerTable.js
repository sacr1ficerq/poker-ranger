import { card } from'./card.js';


export class GameState {
    constructor() {
        this.minBetAmount = 0;
        this.maxBetAmount = 0;

        this.street = 'preflop';
        this.board = [];
        this.pot = 0;
        this.button = 0;

        this.roundEnded = false;
        this.maxBet = 0;
    }

    newRound() {
        this.minBetAmount = 0;
        this.maxBetAmount = 0;

        this.street = 'preflop';
        this.board = [];
        this.pot = 0;
        this.button = 1 - this.button;

        this.roundEnded = false;
        this.maxBet = 0;
    }

    update (RoundData) {
        this.street = RoundData.street
        this.board = RoundData.board
        this.pot = RoundData.pot
        this.maxBetAmount = RoundData.maxBetAmount
        this.minBetAmount = RoundData.minBetAmount
        this.roundEnded = RoundData.roundEnded
        this.maxBet = RoundData.maxBet
    }
}


export const title = {
    view: function(vnode) {
        const tableId = vnode.attrs.tableId;
        console.assert(tableId != undefined, 'tableId expected');
        return m('div', {class: 'text-center mb-8'}, [
            m('h1', {class: 'text-5xl font-bold text-gray-800 mb-2'}, 'POKER RANGER'),
            m('div', {class: 'flex justify-center space-x-4 text-base text-gray-600'},
                m('p', ['table ID: ', m('span', {class: 'font-mono'}, tableId)])
            )
        ])
    }
};

export const TableView = {
    view: function({attrs}) {
        const {gameState} = attrs;
        return m('div', [
            m('#community-cards', {class: 'board'}, gameState.board.map(
                (c) => m(card, {card: c})
            )),
            m('div#pot-display', 'Pot: ' + Math.round(gameState.pot *100) / 100),
        ])
    }
}

export const GameStart = {
    oninit: function() {
        this.startingPot = 0;
    },

    validateInput: function(pot, bb=1, stack=100) {
        this.startingPot = pot;
    },

    view: function({attrs}) {
        const {startGame, canStart} = attrs;
        return m('div', 
            m('div', {class: 'flex justify-center'},
                m('button#start-table mb-4', {
                    class: `btn-primary medium ${ (canStart)? '': 'disabled'}`,
                    onclick: () => {
                        startGame();
                    }
                }, 'Start table'), 
            ),
        )
    }
}

export const RoundStart = {
    view: function({attrs}) {
        const {startRound} = attrs;

        return m('div', {class: 'flex justify-center'}, [
            m('button#start-round', {
                class: 'btn-secondary medium',
                onclick: () => {
                    startRound();
                }
            }, 'New round')
        ])
    }
}
