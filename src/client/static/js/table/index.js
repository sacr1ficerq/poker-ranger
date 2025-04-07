import { TableView, title, GameStart, GameState, RoundStart} from './components/pokerTable.js'
import { ActionsView, Action } from './components/actions.js'
import { Player, VillainView, HeroView } from './components/player.js'
import { modal } from './components/modal.js';
import { handle } from'./socket.io.js';

const PokerTable = {
    state: {
        tableId: 'None',

        depth: 100,
        loggedIn: false,
        gameStarted: false,
        canStart: false,
        profit: 0
    },

    hero: new Player('Anon', 100),
    villain: new Player('Anon', 100),
    gameState: new GameState(),
    oninit: function() {
        const pathSegments = window.location.pathname.split('/');
        this.state.tableId = pathSegments[pathSegments.length - 1];
        this.socket = window.io();
        
        handle(this.socket, this);
    },
    updateNames: function(names) {
        if (names.length == 1){
            this.villain.name = names[0];
        } else if (names.length > 1) {
            console.assert(names.length > 1, 'too many players');
        }
    },
    newRound: function() {
        console.log('new round');
        this.state.gameStarted = true;

        this.gameState.newRound();
        this.hero.newRound();
        this.villain.newRound();
        m.redraw();
        // Add animation of dealing cards and button move
    },
    update: function(tableState) {
        this.gameState.button = tableState.button;

        const hero = tableState.players.find(p => p.name === this.hero.name);
        console.assert(hero != undefined, 'No hero found in players');
        this.hero.update(hero);

        const villain = tableState.players.find(p => p.name === this.villain.name);
        console.assert(villain != undefined, 'No villain found in players');
        this.villain.update(villain);
        
        this.gameState.update(tableState.round);
        console.log('state updated to', tableState);

        m.redraw();
    },
    updatePrivate: function(privateState) {
        this.hero.update(privateState);
        console.log('private state: ', privateState);
        console.log('cards dealt: ', this.hero.cards);
        m.redraw();
    },
    updatePlayers: function(playersState) {
        // function for getting players names after villain or hero sits down
        const hero = playersState.find(p => p.name === this.hero.name);
        console.assert(hero != undefined, `no ${this.hero.name} in` + playersState);
        
        this.hero.update(hero);

        const villain = playersState.find(p => p.name != this.hero.name);
        if (villain) {
            this.villain.update(villain);
        }
        const n = playersState.length;
        if (n == 2) {
            this.state.canStart = true;
        }
        m.redraw();
    },
    message: function(msg) {

    },
    submit: function(username) {
        this.hero.updateName(username);
        this.state.loggedIn = true;
        this.socket.emit('join', { 
            tableId: this.state.tableId, 
            heroName: this.hero.name 
        });
        m.redraw();
    },
    startGame: function (){
        console.log('Starting game'); 
        if (this.state.gameStarted) return;
        this.state.gameStarted = true;
        if (this.state.canStart) {
            this.socket.emit('startTable', {
                tableId: this.state.tableId,
                heroName: this.hero.name
            });
            this.state.gameStarted = true;
        } else {
            console.log('cant start');
        }
        m.redraw();
    },
    gameStarted: function (){
        this.state.gameStarted = true;
        m.redraw();
    },
    startRound : function() {
        console.log('Starting new round');
        console.assert(this.gameState.roundEnded, 'Round not ended');
        this.socket.emit('startRound', {tableId: this.state.tableId, heroName: this.hero.name});
    },
    act: function(action, amount=0.0, valid=true) {
        if ((action == Action.BET || action == Action.RAISE) && !valid) {
            console.log('invalid sizing');
            return;
        }
        const req = { 
            tableId: this.state.tableId, 
            amount: amount, 
            heroName: this.hero.name, 
            action: action
        };
        console.log('acting: ', req);
        this.socket.emit('action', req);
        m.redraw();
    },
    view: function(vnode) {
        console.log('game state: ', this.gameState)
        return m('div', {class: 'bg-gray-100 h-screen'},
            m('div', {class: 'container mx-auto px-4 py-6'}, [
                m(title, {tableId: this.state.tableId}),
                !this.state.loggedIn && m(modal, {
                    villainName: 
                    this.villain.name, 
                    submit: (username) => this.submit(username)}),
                // Game Table
                m('div', {class: 'relative max-w-2xl mx-auto mb-8 mt-20'}, [
                    m(VillainView, {villain: this.villain}),
                    m(TableView, {gameState: this.gameState, heroBet: this.hero.bet, villainBet: this.villain.bet}),
                    m(HeroView, {hero: this.hero})
                ]),
                this.state.gameStarted && this.hero.state == 'acting' && 
                    m(ActionsView, {
                        gameState: this.gameState, 
                        act: (action, amount=0.0, valid=true) => this.act(action, amount, valid),
                        heroBet: this.hero.bet
                    }),
                this.state.gameStarted && this.gameState.roundEnded && m(RoundStart, {
                    startRound: () => this.startRound()}),
                !this.state.gameStarted && m(GameStart, {
                    startGame: () => this.startGame(),
                    canStart: this.state.canStart})
                
            ])
        )
    },

};

m.mount(document.body, PokerTable);
