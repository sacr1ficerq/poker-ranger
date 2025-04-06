export const Action = {
    BET: 'bet',
    CALL: 'call',
    RAISE: 'raise',
    FOLD: 'fold',
    CHECK: 'check'
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

        return m('#actions', [
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
            ])
        ])
    }
}

