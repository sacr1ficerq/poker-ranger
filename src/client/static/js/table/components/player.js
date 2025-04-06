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
        this.stack = stack;
        this._depth = stack;
        this.state = PlayerState.BASE;
        this.cards= ['', ''];
    }

    update(player) {
        console.log('player updated to ', player);
        this.name = player.name
        this.stack = player.stack;
        this.state = player.state;
        if (player.bet != null){
            this.bet = player.bet;
        }
        if (player.cards != null) {
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

    newRound() {
        this.state = PlayerState.BASE;
        this.stack = this._depth;
        this.cards= ['', ''];
    }
}


export const HeroView = {
    view: function({attrs}) {
        const hero = attrs.hero;
        return m('#hero', {class: 'player-area absolute -bottom-16 center-x text-center ' + hero.state}, [
            m('div', {class: 'bg-white rounded-lg p-3 shadow-md'}, [
                m('#hero-name', {class: 'text-xs text-gray-600'}, hero.name),
                m('div', {class: 'flex space-x-2 mt-1'}, [
                    m(card, {card: hero.cards[0]}),
                    m(card, {card: hero.cards[1]})
                ]),
                m('#hero-stack', {class: 'text-xs text-gray-600'}, hero.stack)
            ])
        ])
    }
}

export const VillainView = {
    view: function({attrs}) {
        const villain = attrs.villain;
        return m('#villain', {class: 'player-area absolute -top-16 center-x text-center ' + villain.state}, [
            m('div', {class: 'bg-white rounded-lg p-3 shadow-md'}, [
                m('#villain-name', {class: 'text-xs text-gray-600'}, villain.name),
                m('div', {class: 'flex space-x-2 mt-1'}, [
                    m(card, {card: villain.cards[0]}),
                    m(card, {card: villain.cards[1]})
                ]),
                m('#villain-stack', {class: 'text-xs text-gray-600'}, villain.stack)
            ])
        ])
    }
}

