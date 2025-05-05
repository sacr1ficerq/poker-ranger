export const Action = {
    BET: 'bet',
    CALL: 'call',
    RAISE: 'raise',
    FOLD: 'fold',
    CHECK: 'check'
}

export const sizings = {
    'preflop': [1], // 1 = 100% = 2.5bb
    'flop': [0.25, 0.4, 0.75, 1.5],
    'turn': [0.25, 0.4, 0.75, 1.5],
    'river': [0.25, 0.4, 0.75, 1.5],
}

// In position single raise pot
const sizingsIPSRP = {
    'preflop': ['2.5bb'], // 2.5bb
    'flop': [0.25, 0.4, 0.75, 1.5, 'all-in'],
    'flop': [0.25, 0.4, 0.75, 1.5, 'all-in'],
    'flop': [0.25, 0.4, 0.75, 1.5, 'all-in'],
}

// Out of position
const sizingsOOPSRP = {
    'preflop': ['2.5bb'],
    'flop': [0.25, 0.4, 0.75, 1.5, 'all-in'],
    'flop': [0.25, 0.4, 0.75, 1.5, 'all-in'],
    'flop': [0.25, 0.4, 0.75, 1.5, 'all-in'],
}

const ActionButton = {
    oninit: function (vnode) {
        const { k } = vnode.attrs;
        console.log("k: \'"+ k + "\'");
        vnode.state.keyHandler = (e) => {
            if (e.key === k) {
                console.log(k + ' pressed');
                vnode.dom.click();
            }
        }
    },
    view: function({attrs}) {
        const {k, txt} = attrs;
        return m('button.relative', attrs, [txt, m('div', {class: 'hint text-white'}, k)]);
    },
    oncreate: function(vnode) {
        document.addEventListener('keydown', vnode.state.keyHandler)
    },
    onremove: function(vnode) {
        document.removeEventListener('keydown', vnode.state.keyHandler)
    }
}

export const ActionsView = {
    oninit: function() {
        this.isFocused = false;
    },
    validateBetAmount: function(amount, minBet, maxBet) {
        this.valid = amount >= minBet && amount <= maxBet;
        m.redraw();
    },
    getBetAmount: function() {
        const betAmount = document.getElementById('bet-amount');
        console.assert(betAmount != undefined, 'no bet-amount elment');
        return Math.round(parseFloat(betAmount.value)*100)/100;
    },
    view: function({attrs}) {
        const {maxBet, minBetAmount, maxBetAmount, pot} = attrs.gameState;

        const act = attrs.act;
        const stack = attrs.heroStack;
        const heroBet = attrs.heroBet;
        const villainBet = attrs.villainBet;

        const raisable = maxBet != 0;
        const callable = maxBet != 0 && maxBet != heroBet;

        const delta = maxBet - heroBet;
        console.log('Max bet: ', maxBet)
        const sizings = [0.25, 0.4, 0.33, 0.5, 0.66, 0.75, 1.0, 1.5, 2.0];
        return m('#actions',
            m('div', {class: 'flex justify-center space-x-4 mb-4'}, [
                m(ActionButton, {id: 'btn-fold', onclick: () => act(Action.FOLD, 0, this.valid), txt: 'Fold', k: 'f'}),
                callable? 
                    m(ActionButton, {id: 'btn-call', onclick: () => act(Action.CALL, delta, this.valid), txt: 'Call', k: 'c'}):
                    m(ActionButton, {id: 'btn-check', onclick: () => act(Action.CHECK, 0, this.valid), txt: 'Check', k: 'x'}),
                m('div', {class: 'flex space-x-2'}, [
                    m('input#bet-amount', {
                        type: 'number',
                        placeholder: 'Amount',
                        oninput: (e) => {
                            this.validateBetAmount(e.target.value, minBetAmount, maxBetAmount);
                        },
                        onfocus: () => { this.isFocused = true; },
                        onblur: () => { this.isFocused = false; }
                    }),
                    raisable? 
                        m(ActionButton, {id: 'btn-raise',
                            onclick: () => {act(Action.RAISE, this.getBetAmount(), this.valid);},
                            class: this.valid? '': 'disabled',
                            txt: 'Raise',
                            k: 'r'}) :

                        m(ActionButton, {id: 'btn-bet',
                            onclick: () => {act(Action.BET, this.getBetAmount()), this.valid},
                            class: this.valid? '': 'disabled',
                            txt: 'Bet',
                            k: 'b'})
                ]),
            ]),
            m(SizingView, {
                sizings,
                pot,
                stack, 
                heroBet,
                villainBet,
                focused: () => this.isFocused,
                validate: (amount) => this.validateBetAmount(amount, minBetAmount, maxBetAmount)
            })
        )
    }
}

const Sizing = {
    oninit: function(vnode) {
        vnode.state.keyHandler = (e) => {
            const k = vnode.attrs.idx + 1;
            if (e.key === k.toString()) {
                console.log(k + ' pressed');
                if (vnode.attrs.focused()) {
                    return;
                }
                const betAmount = document.getElementById('bet-amount');
                console.assert(betAmount != undefined, 'no bet-amount elment');
                vnode.dom.click();
                vnode.dom.focus()
            }
        }
    },
    clicked: function(amount, validate) {
        console.log('amount: ', amount);
        const betAmount = document.getElementById('bet-amount');
        console.assert(betAmount != undefined, 'no bet-amount elment');
        betAmount.value = amount;
        validate(amount);
    },
    oncreate: function(vnode) {
        document.addEventListener('keydown', vnode.state.keyHandler)
    },
    onremove: function(vnode) {
        document.removeEventListener('keydown', vnode.state.keyHandler)
    },
    view: function({attrs}) {
        const {sizing, idx, pot, validate, toCall} = attrs;
        const text = (sizing * 100) + '%';
        const k = idx + 1;
        var size = pot * sizing + toCall;
        if (sizing === 0.66) {
            size = pot * 2 / 3 + toCall;
        }
        if (sizing === 0.33) {
            size = pot / 3 + toCall;
        }
        return m('button.sizing-option', 
            {onclick: () => this.clicked(Math.round((size)*100)/100, validate)},
            [text, m('div', {style: "right: 1px;",class: 'hint text-gray-800'}, k)])
    }
}

export const SizingView = {
    view: function({attrs}) {
        const {sizings, pot, stack, focused, validate, heroBet, villainBet} = attrs;
        const c = villainBet - heroBet; // to call
        const s = pot + c;
        console.log('bets:', heroBet, villainBet, pot);
        // console.assert(sizings[street] != undefined, 'wrong sizings ' + sizings[street] + ' ' + street)

        return m('div', {class: 'flex w-full rounded-lg'}, 
            sizings.map((sizing, idx) => m(Sizing, {focused, sizing, idx, pot: s, validate, toCall: c})).concat(
            m('button.sizing-option', {onclick: () => {
                const betAmount = document.getElementById('bet-amount');
                console.assert(betAmount != undefined, 'no bet-amount elment');
                console.assert(stack != undefined, 'no stack');
                betAmount.value = stack;
                validate(stack);
            }}, 'all-in'))
        )
    }
}

