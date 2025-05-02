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
        console.log('valid bet: ', this.valid, minBet, maxBet)
        m.redraw();
    },
    getBetAmount: function() {
        const betAmount = document.getElementById('bet-amount');
        console.assert(betAmount != undefined, 'no bet-amount elment');
        return parseFloat(betAmount.value);
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
        const sizings = [0.1, 0.25, 0.33, 0.5, 0.66, 0.75, 1.0, 1.25, 1.5];
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
            m(SizingView, {sizings, pot, stack, validate: (amount) => this.validateBetAmount(amount, minBetAmount, maxBetAmount)})
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
        const {sizing, idx, pot, validate} = attrs;
        const text = (sizing * 100) + '%';
        const k = idx + 1;
        return m('div.sizing-option', {onclick: () => this.clicked(pot * sizing, validate)},text)
    }
}

export const SizingView = {
    view: function({attrs}) {
        const {sizings, pot, stack, validate} = attrs;
        // console.assert(sizings[street] != undefined, 'wrong sizings ' + sizings[street] + ' ' + street)

        return m('div', {class: 'flex w-full bg-secondary/20 rounded-lg overflow-hidden'}, 
            sizings.map((sizing, idx) => m(Sizing, {sizing, idx, pot, validate})).concat(
            m('div.sizing-option', {onclick: () => {
                const betAmount = document.getElementById('bet-amount');
                console.assert(betAmount != undefined, 'no bet-amount elment');
                console.assert(stack != undefined, 'no stack');
                betAmount.value = stack;
                validate(stack);
            }},'all-in'))
        )
    }
}

