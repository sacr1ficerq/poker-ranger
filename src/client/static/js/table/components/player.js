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
            console.log(button);
            console.log(this.name, ' position: ', this.position);
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


export const HeroView = {
    view: function({attrs}) {
        const hero = attrs.hero;
        console.log('rendering cards:', hero.cards);
        return m('#hero', {class: 'player-area absolute left-10 ' + hero.state}, [
            m('div', {class: 'player-items'}, [
                m('div.player-position', {class: `bg-${hero.position == 'D' ? 'yellow-600': 'gray-100'}`}, hero.position),
                m('div.player-name', hero.name),
                m('div.player-stack', hero.stack),
                m('div.player-profit text-win', hero.profit),
                m('div.cards-container', [
                    m(card, {key: hero.cards[0], card: hero.cards[0]}),
                    m(card, {key: hero.cards[1], card: hero.cards[1]})
                ]),
                m('div.bet-placed.center-x', `Bet: ${hero.bet}`)
            ])
        ])
    }
}

export const VillainView = {
    view: function({attrs}) {
        const villain = attrs.villain;
        return m('#villain', {class: 'player-area absolute right-10 ' + villain.state}, [
            m('div', {class: 'player-items'}, [
                m('div.player-position', {class: `bg-${villain.position == 'D' ? 'yellow-600': 'gray-100'}`}, villain.position),
                m('div.player-name', villain.name),
                m('div.player-stack', villain.stack),
                m('div.player-profit text-win', villain.profit),
                m('div.cards-container', [
                    m(card, {key: villain.cards[0], card: villain.cards[0]}),
                    m(card, {key: villain.cards[1], card: villain.cards[1]})
                ]),
                m('div.bet-placed.center-x', `Bet: ${villain.bet}`)
            ])
        ])
    }
}

