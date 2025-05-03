import { card } from './card.js';

export const PlayerState = {
    BASE: '',
    ACTING: 'acting',
    FOLDED: 'folded',
    WINNING: 'winning',
    ALLIN: 'all-in',
}

export class Player {
    constructor(name, stack) {
        this.name = name;
        this.bet = 0;
        this.lastAction = '';
        this.stack = stack;
        this.profit = 0;
        this._depth = stack;
        this.state = PlayerState.BASE;
        this.cards = [null, null];
        this.preflopRange = new Range();
        this.position = 'BB'
    }

    update(player, button) {
        console.log('player updated to ', player);
        this.name = player.name
        this.stack = player.stack;
        if (button != null) {
            this.position = button === this.name? 'D' : 'BB';
        }
        if (player.state != null) {
            this.state = player.state;
        }
        if (player.profit != null) {
            this.profit = player.profit;
        }
        if (player.lastAction != null) {
            this.lastAction = player.lastAction;
        }
        if (player.bet != null){
            this.bet = player.bet;
        }
        if (player.cards != null) {
            console.log('card update: ', player.cards);
            this.cards = player.cards;
        }
    }

    updateCards(cards) {
        console.log('cards updated to ', cards);
        this.cards = cards;
    }

    updateName(name) {
        console.log('name updated to ', name);
        this.name = name;
    }

    updatePreflopRange(preflopRange) {
        console.log('range updated to ', preflopRange);
        this.preflopRange = preflopRange;
    }

    newRound() {
        this.state = PlayerState.BASE;
        this.stack = this._depth;
        this.cards= [null, null];
    }
}


export const PlayerView = {
    view: function({attrs}) {
        const {player, pos} = attrs;
        return m('#player', {class: `player-area absolute ${player.state} ${pos}`}, [
            m('div', {class: 'player-items'}, [
                m('div.player-position', {
                    class: `${player.position == 'D' ? 'text-white bg-yellow-600': 'text-black bg-gray-100'}`
                }, player.position),
                m('div.player-name', player.name),
                m('div.player-stack', player.stack),
                m('div.player-profit text-win', `${player.profit < 0 ? '' : '+'}${player.profit}`),
                m('div.cards-container', [
                    m(card, {key: player.cards[0], card: player.cards[0]}),
                    m(card, {key: player.cards[1], card: player.cards[1]})
                ]),
                m('div.bet-placed.center-x', `Bet: ${player.bet}`)
            ])
        ])
    }
}
