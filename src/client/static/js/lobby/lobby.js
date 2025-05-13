import { lobbyList } from "./components/lobbyList.js"

const createForm = {
    oninit: function() {
        this.validDepth = true;
        this.validPot = true;
        this.preflopSpot = 'SRP BUTvsBB HU 5.0bb';
        this.editRanges = false;
        this.inPosition = false;
        this.moveButton = false;
    },
    validateDepth: function(depth) {
        this.validDepth = depth > 0;
    },
    validatePot: function(startingPot) {
        this.validPot = startingPot >= 0;
    },
    view: function({attrs}) {
        const {submit} = attrs;
        return m('form#create-form', {
            onsubmit: (e) => {
                e.preventDefault();
                if (!this.validPot || !this.validDepth) {
                    console.log('invalid parameters');
                    return;
                }
                const depth = document.getElementById('depth').value.trim();
                console.assert(depth != undefined, 'depth element undefined');

                const pot = document.getElementById('starting-pot').value.trim();
                console.assert(pot != undefined, 'pot element undefined');

                submit(pot, depth, this.preflopSpot, this.inPosition);
            }
        }, [
            m('div', [
                m('div', [
                    m('label', {class: 'block text-sm text-gray-600 mb-2', for: 'game-type'}, 'Preflop Spot'),
                    m('select#game-type', {
                        class: 'w-full px-4 py-2 border border-gray-200 rounded-lg',
                        onchange: (e) => {this.preflopSpot = e.target.value; console.log(e.target.value);}
                    }, [
                        m('option', {value: 'SRP BUTvsBB HU 5.0bb'}, 'SRP BBvsBUT HU 100bb'),
                        m('option', {value: 'default'}, 'Custom'),
                        // m('option', {value: 'option B'}, '3BP BBvsBUT HU 100bb'),
                        // m('option', {value: 'option C'}, 'SRP BBvsBUT 6max 100bb')
                    ])
                ]),
                m('label', {class: 'block text-sm text-gray-600 mb-2', for: 'depth'}, 'Depth (effective stack)'),
                m('input#depth', {
                    class: 'w-full px-4 py-2 border border-gray-200 rounded-lg',
                    type: 'number',
                    value: 100,
                    placeholder: 'Depth e.g. 100bb',
                    oninput: (e) => {
                        const depth = e.target.value.trim();
                        console.assert(depth != undefined, 'depth undefined');
                        this.validateDepth(depth);
                    },
                }),
                m('label', {class: 'block text-sm text-gray-600 mb-2', for: 'staringPot'}, 'Starting pot'),
                m('input#starting-pot', {
                    class: 'w-full px-4 py-2 border border-gray-200 rounded-lg',
                    type: 'number',
                    placeholder: 'Starting pot e.g. 4bb',
                    value: 5,
                    oninput: (e) => {
                        const pot = e.target.value.trim();
                        console.assert(pot != undefined, 'pot undefined');
                        this.validatePot(pot);
                    },
                }),
                m('div', [
                    m('label', {class: 'block text-sm text-gray-600 mb-2'}, 'Play in position'),
                    m('label', {class: 'inline-flex items-center cursor-pointer'}, [
                        m('input', {
                            type: 'checkbox',
                            class: 'sr-only peer',
                            onchange: (e) => {console.log(e.target.checked); this.inPosition = e.target.checked;}
                        }),
                        m('div', {
                            class: 'toggle peer peer-checked:bg-gray-600 peer-checked:after:translate-x-full'
                        }),
                        m('span', {class: 'ml-3'}, `${this.inPosition? 'IP':'OOP'}`)
                    ])
                ]),
                m('div', {class: `${this.preflopSpot == 'default'? 'hidden' : ''}`}, [
                    m('label', {class: 'block text-sm text-gray-600 mb-2'}, 'Move button'),
                    m('label', {class: 'inline-flex items-center cursor-pointer'}, [
                        m('input', {
                            type: 'checkbox',
                            class: 'sr-only peer',
                            onchange: (e) => {console.log(e.target.checked); this.moveButton = e.target.checked;}
                        }),
                        m('div', {
                            class: 'toggle peer peer-checked:bg-gray-600 peer-checked:after:translate-x-full'
                        }),
                        m('span', {class: 'ml-3'}, 'Move')
                    ])
                ]),


                m('div', {class: `${this.preflopSpot == 'default'? 'hidden' : ''}`}, [
                    m('label', {class: 'block text-sm text-gray-600 mb-2'}, 'Edit Ranges'),
                    m('label', {class: 'inline-flex items-center cursor-pointer'}, [
                        m('input', {
                            type: 'checkbox',
                            class: 'sr-only peer',
                            onchange: (e) => {console.log(e.target.checked); this.editRanges = e.target.checked;}
                        }),
                        m('div', {
                            class: 'toggle peer peer-checked:bg-gray-600 peer-checked:after:translate-x-full'
                        }),
                        m('span', {class: 'ml-3'}, 'Enable')
                    ])
                ])
            ]),
            m('button#game-submit', {
                class: `${(this.validPot && this.validDepth)? '' : 'disabled'}`,
                type: 'submit',
            }, 'Continue')
        ])
    }
}


const modal = {
    view: function({attrs}) {
        return m('#create-modal', [
            m('#modal-block', [
                m('h2#modal-hint', 'Enter game parameters'),
                m(createForm, attrs)
            ])
        ])
    }
}

const Lobby = {
    renderTables: function(tables) {
        this.tables = tables;
        m.redraw();
        console.log(tables);
    },
    oninit: function() {
        this.creating = false;
        this.tables = [];
        this.socket = window.io();
        this.socket.on('updateTables', (data) => {
            this.renderTables(data.tables);
        });
        this.socket.on('invite', (data) => {
            window.location.href = `/table/${data.tableId}`;
        });
        this.socket.emit('requestTables');
        setInterval(() => this.socket.emit('requestTables'), 10000);
    },
    createTable: function() {
        this.creating = true;
    },
    submit: function(pot, depth, preflopSpot, inPosition) {
        // this.editRanges = false;

        console.log('creating with: ', pot, depth, 'preflop spot:', preflopSpot, inPosition);
        this.socket.emit('createTable', {startingPot: pot, depth, preflopSpot, inPosition});
    },
    view: function() {
        const title = m('div', {class:'div flex items-center justify-between mb-8'}, [
            m('h1', {class: 'text-4xl font-bold text-gray-800'}, 'Poker lobby'),
            m('a', {class: 'btn-nice medium rounded-lg', onclick: () => this.createTable()}, 'New table')
        ]);

        const refresh = () => {
            this.socket.emit('requestTables');
            console.log('creating: ', this.creating)
            console.log('Refreshing lobby...');
        }

        return m('div', {class: 'min-h-screen bg-gray-100'}, 
            m('div', {class: 'container mx-auto px-4 py-8 max-w-4xl'}, [
                title, 
                m(lobbyList, {tables: this.tables, refresh: refresh}),
                this.creating && m(modal, {submit: (pot, depth, spot, pos) => this.submit(pot, depth, spot, pos)})
            ])
        )
    }
}

m.mount(document.body, Lobby);
