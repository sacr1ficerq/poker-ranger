export const card = {
    view: function({attrs}) {
        const {card} = attrs;
        if (card == undefined || card === '' || card.length == 1) {
            return m('div', {class: 'player-card'});
        }
        const nom = card[0];
        const suit = card[1];

        const content = nom + suits[suit] || '';
        const black = suit == 'c' || suit == 's';
        return m('div', {class: `player-card ${black? 'text-black' : 'text-red-500'}`}, content)
    }
}


const noms = "23456789TJQKA";
const suits = {
    'h': '♥',
    'd': '♦',
    's': '♠',
    'c': '♣'
};

