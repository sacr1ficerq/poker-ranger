export const card = {
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


const noms = "23456789TJQKA";
const suits = {
    'h': '♥',
    'd': '♦',
    's': '♠',
    'c': '♣'
};

