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

export const ActionsView = {
    validateBetAmount: function(amount, minBet, maxBet) {
        this.valid = amount >= minBet && amount <= maxBet;
        m.redraw();
    },
    getBetAmount: function() {
        const betAmount = document.getElementById('bet-amount');
        console.assert(betAmount != undefined, 'no bet-amount elment');
        return parseFloat(betAmount.value);
    },
    view: function({attrs}) {
        const {maxBet, minBetAmount, maxBetAmount} = attrs.gameState;
        const act = attrs.act;
        const heroBet = attrs.heroBet;

        const raisable = maxBet != 0;
        const callable = maxBet != 0 && maxBet != heroBet;

        const delta = maxBet - heroBet;
        console.log('Max bet: ', maxBet)

        return m('#actions',
            m('div', {class: 'flex justify-center space-x-4 mb-4'}, [
                m('button#btn-fold', {onclick: () => act(Action.FOLD, 0, this.valid)}, 'Fold'),
                callable? 
                    m('button#btn-call', {onclick: () => act(Action.CALL, delta, this.valid)}, 'Call'):
                    m('button#btn-check', {onclick: () => act(Action.CHECK, 0, this.valid)}, 'Check'),
                m('div', {class: 'flex space-x-2'}, [
                    m('input#bet-amount', {
                        type: 'number',
                        placeholder: 'Amount',
                        oninput: (e) => {
                            this.validateBetAmount(e.target.value, minBetAmount, maxBetAmount);
                        }
                    }),
                    raisable? 
                        m('button#btn-raise', {
                            class: this.valid? '': 'disabled',
                            onclick: () => {act(Action.RAISE, this.getBetAmount(), this.valid);}}, 'Raise') :
                        m('button#btn-bet', {
                            class: this.valid? '': 'disabled',
                            onclick: () => {act(Action.BET, this.getBetAmount()), this.valid}}, 'Bet')
                ]),
            ]),
            m('div', {class: 'flex w-full bg-secondary/20 rounded-lg overflow-hidden'}, [
                m('div.sizing-option', '10%'),
                m('div.sizing-option', '25%'),
                m('div.sizing-option', '50%'),
                m('div.sizing-option', '100%'),
                m('div.sizing-option', 'all-in')
            ])
        )
    }
}

const Sizing = {
    oninit: function(vnode) {
        vnode.state.keyHandler = (e) => {
            const k = vnode.attrs.idx + 1;
            if (e.key === k.toString()) {
                console.log(k + ' pressed');
                vnode.dom.click()
            }
        }
    },
    oncreate: function(vnode) {
        document.addEventListener('keydown', vnode.state.keyHandler)
    },
    onremove: function(vnode) {
        document.removeEventListener('keydown', vnode.state.keyHandler)
    },
    view: function({attrs}) {
        const {sizing, idx} = attrs;
        const text = (sizing * 100) + '%';
        const k = idx + 1;
        return m('button', {class: 'sizing'}, [text, m('div', {class: 'hint'}, k)])
    }
}

export const SizingView = {
    view: function({attrs}) {

        const {sizings, street} = attrs;
        console.log(sizings);
        console.assert(sizings[street] != undefined, 'wrong sizings ' + sizings[street] + ' ' + street)

        return m('#sizings', sizings[street].map((sizing, idx) => m(Sizing, {sizing, idx})))
    }
}

