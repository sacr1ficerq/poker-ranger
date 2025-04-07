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
            m('h1', {class: 'text-4xl font-bold text-gray-800 mb-2'}, 'POKER BAKER'),
            m('div', {class: 'flex justify-center space-x-4 text-sm text-gray-600'},
                m('p', ['table ID: ', m('span', {class: 'font-mono'}, tableId)])
            )
        ])
    }
};

export const TableView = {
    view: function({attrs}) {
        const {gameState, heroBet, villainBet} = attrs;

        return m('div', {class: 'poker-table'}, [
            m('div#villain-bet', {class: 'bet-placed-villain'}, villainBet),
            m('#community-cards', {class: 'board'}, gameState.board.map(
                (c) => m(card, {card: c})
            )),
            m('div#pot-display', {class: 'pot mt-8'}, 'Pot: ' + gameState.pot),
            m('div#dealer-button', {class: 'dealer-button'}, 'D'), // TODO move dealer
            m('div#hero-bet', {class: 'bet-placed-hero'}, heroBet)
        ])
    }
}

export const GameStart = {
    view: function({attrs}) {
        const {startGame, canStart} = attrs;

        return m('div', {class: 'flex justify-center mt-24'}, [
            m('button#start-table', {
                class: `btn-primary medium ${canStart? '': 'disabled'}`,
                onclick: () => {
                    startGame();
                }
            }, 'Start table')
        ])
    }
}

export const RoundStart = {
    view: function({attrs}) {
        const {startRound} = attrs;

        return m('div', {class: 'flex justify-center mt-24'}, [
            m('button#start-round', {
                class: 'btn-secondary medium',
                onclick: () => {
                    startRound();
                }
            }, 'New round')
        ])
    }
}
