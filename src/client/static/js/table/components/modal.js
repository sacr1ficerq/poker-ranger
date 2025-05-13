const usernameForm = {
    oninit: function(vnode) {
        this.valid = false;
    },
    validateInput: function(username, villainName) {
        const submitBtn = document.getElementById('username-submit');
        console.assert(submitBtn);
        if (username === '' || username === villainName) {
            this.valid = false;
        } else {
            this.valid = true;
        }
    },
    view: function({attrs}) {
        const {villainName, submit} = attrs;
        return m('form#username-form', {
            onsubmit: (e) => {
                e.preventDefault();
                if (!this.valid) {
                    console.log('invalid username');
                    return;
                }
                const username = document.getElementById('username').value.trim();
                console.assert(username != undefined, 'username element undefined');
                submit(username);
            }
        }, [
            m('div', [
                m('label', {class: 'block text-base text-gray-600 mb-2', for: 'username'}, 'Username'),
                m('input#username', {
                    oncreate: function(vnode) {
                        vnode.dom.focus(); // Focus the input after DOM creation
                    },
                    class: 'w-full px-4 py-2 border border-gray-200 rounded-lg',
                    type: 'text',
                    placeholder: 'Enter username',
                    oninput: (e) => {
                        const username = e.target.value.trim();
                        console.assert(username != undefined, 'username undefined');
                        this.validateInput(username, villainName);
                    }
                })
            ]),
            m('button#username-submit', {
                class: `${this.valid? '' : 'disabled'}`,
                type: 'submit',
            }, 'Continue')
        ])
    }
}

export class RangeView {
    oninit({attrs}) {
        this.matrix = Array(13).fill().map(() => Array(13).fill(0));
        this.valid = false;
    }

    validateRange() {
        const submitBtn = document.getElementById('range-submit');
        console.assert(submitBtn);
        const s = this.matrix.flat().reduce((sum, cell) => sum + cell, 0);
        if (s == 0) {
            this.valid = false;
        } else {
            this.valid = true;
        }
    }

    view({attrs}) {
        const {submit} = attrs;
        const ranks = ['A','K','Q','J','T','9','8','7','6','5','4','3','2'];
        
        return m('div', [
            m('#range-grid', 
                ranks.map((_, i) => 
                    ranks.map((_, j) => {
                        const prob = this.matrix[i][j];
                        const bgColor = `hsl(120, 100%, ${100 - (prob * 50)}%)`;
                        
                        return m('.range-cell', {
                            style: `background: ${bgColor};`,
                            class: `${i === j? 'border-gray-200 border-2': ''}`,
                            onclick: (event) => {
                                if (event.shiftKey) {
                                    if (i == j) {
                                        for (var y = 0; y <= i; ++y) {
                                            const prob = this.matrix[y][y];
                                            const newProb = 1;
                                            this.matrix[y][y] = newProb;
                                        }
                                    } else if (i < j) {
                                        for (var x = i; x <= j; ++x) {
                                            const prob = this.matrix[i][x];
                                            const newProb = 1;
                                            this.matrix[i][x] = newProb;
                                        }
                                    }  else if (i > j) {
                                        for (var y = j; y <= i; ++y) {
                                            const prob = this.matrix[y][j];
                                            const newProb = 1;
                                            this.matrix[y][j] = newProb;
                                        }
                                    }

                                } else {
                                    const prob = this.matrix[i][j];
                                    const newProb = prob >= 1 ? 0 : Math.min(1, prob + 1);
                                    this.matrix[i][j] = newProb;
                                }
                                // const newProb = prob >= 1 ? 0 : Math.min(1, prob + 0.1);
                                this.validateRange();
                            }
                        }, 
                            i === j ? `${ranks[i]}${ranks[j]}` : 
                            i < j ? `${ranks[i]}${ranks[j]}s` : 
                            `${ranks[j]}${ranks[i]}o`
                        );
                    })
                )
            ), 
            m('button#range-submit', {
                class: `${this.valid? '' : 'disabled'}`,
                onclick: () => {
                    if (this.valid) {
                        submit(this.matrix);
                    } else {
                        console.log('wrong range');
                    }
                }
            }, 'Continue')
        ])
    }
}


export const modal = {
    view: function({attrs}) {
        return m('#username-modal', [
            m('#modal-block', [
                m('h2#modal-hint', 'Enter Your Username'),
                m(usernameForm, attrs)
            ])
        ])
    }
}

export const rangeModal = {
    view: function({attrs}) {
        return m('#range-modal', [
            m('#range-block', [
                m('h2#range-hint', 'Enter Your Preflop Range'),
                m(RangeView, attrs)
            ])
        ])
    }
}




export class Range {
    constructor(matrix = null) {
        // 13x13 matrix (AA at [0,0], 22 at [12,12])
        this.matrix = matrix || Array(13).fill().map(() => Array(13).fill(0));
    }
    
    setHand(rank1, rank2, isSuited, probability) {
        const lower = Math.min(rank1, rank2);
        const higher = Math.max(rank1, rank2);

        if (lower === higher) {
            this.matrix[rank1][rank2] = probability;
        } 
        else if (isSuited) {
            this.matrix[lower][higher] = probability;
        }
        else {
            this.matrix[higher][lower] = probability;
        }
    }
    
    toJSON() {
        return this.matrix;
    }
    
    static fromJSON(matrix) {
        return new Range(matrix);
    }
}
