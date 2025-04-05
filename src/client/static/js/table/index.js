import { villain, hero, pokerTable, startGame, actions } from './components/pokerTable.js'
import { modal } from './components/modal.js';
import { handle } from'./socket.io.js';


export const title = {
    view: function(vnode) {
        const tableId = vnode.attrs.tableId;
        console.assert(tableId != undefined, 'tableId expected');
        return m('div', {class: 'text-center mb-8'}, [
            m('h1', {class: 'text-4xl font-bold text-gray-800 mb-2'}, 'POKER BAKER'),
            m('div', {class: 'flex justify-center space-x-4 text-sm text-gray-600'},
                m('p', ['table ID: ', m('span', {class: 'font-mono'}, tableId)])
            )
        ])
    }
};

export const PokerTable = {
    socket: null,
    state: {
        tableId: 'None',
        heroName: 'Anonymous',
        villainName: 'Anonymous',

        loggedIn: false,
        gameStarted: false,
        canStart: false,
        profit: 0
    },
    gameState: {
        minBetAmount: 2,
        maxBetAmount: 0,

        street: 'preflop',

        board: [],
        maxBet: 0,
        pot: 0,
        roundEnded: false,
        button: 0,

        hero: {
            bet: 0,
            stack: 0,
            folded: false,
            win: false,
            allIn: false,
            acting: false,
            cards: ['', '']
        },
        villain: {
            bet: 0,
            stack: 0,
            folded: false,
            win: false,
            allIn: false,
            acting: false,
            cards: ['', '']
        }
    },
    oninit: function() {
        const pathSegments = window.location.pathname.split('/');
        this.state.tableId = pathSegments[pathSegments.length - 1];
        this.socket = window.io();
        handle(this.socket, this);
    },
    startGame: function() {
        this.state.gameStarted = true;
        m.redraw();
    },
    updateNames: function(names) {
        if (names.length == 1){
            this.state.villainName = names[0];
        } else if (names.length > 1) {
            console.assert(names.length > 1, 'to many players');
        }
    },
    newRound: function() {
        this.state.gameStarted = true;
        this.gameState = {
            minBetAmount: 2,
            maxBetAmount: 0,

            street: 'preflop',

            board: [],
            maxBet: 0,
            pot: 0,
            roundEnded: false,
            button: 0,

            hero: {
                bet: 0,
                stack: 100,
                folded: false,
                win: false,
                allIn: false,
                acting: false,
                cards: ['', '']
            },
            villain: {
                bet: 0,
                stack: 100,
                folded: false,
                win: false,
                allIn: false,
                acting: false,
                cards: ['', '']
            }
        };
        m.redraw();
        // Add animation of dealing cards and button move
    },
    update: function(tableState) {
        this.gameState.button = tableState.button;

        const hero = tableState.players.find(p => p.name === this.state.heroName);
        console.assert(hero != undefined, 'No hero found in players');
        this.gameState.hero.bet = hero.bet;
        this.gameState.hero.stack = hero.stack;
        this.gameState.hero.folded = hero.folded != 0;
        this.gameState.hero.allIn = hero.allIn != 0;

        const villain = tableState.players.find(p => p.name === this.state.villainName);
        console.assert(villain != undefined, 'No villain found in players');
        this.gameState.villain.bet = villain.bet;
        this.gameState.villain.stack = villain.stack;
        this.gameState.villain.folded = villain.folded != 0;
        this.gameState.villain.allIn = villain.allIn != 0;

        this.gameState.board = tableState.round.board;
        this.gameState.street = tableState.round.street;
        this.gameState.pot = tableState.round.pot;

        if (tableState.round.roundEnded) {
            if (tableState.round.street == 'showdown') {
                const villain = tableState.round.players.find(p => p.name === this.state.villainName);
                this.gameState.villain.cards = villain.cards;
            } 
            console.log(tableState.round.winners)
            this.gameState.hero.winning = tableState.round.winners.find(name => name === this.state.heroName) != undefined;
            console.log('Hero winning: ', this.gameState.hero.winning)
            this.gameState.villain.winning = tableState.round.winners.find(name => name === this.state.villainName) != undefined;
            console.log('Villain winning: ', this.gameState.villain.winning)
        } else {
            const actingName = tableState.round.acting;
            console.assert(actingName != undefined, 'No actingName in tableState');
            console.log('acting:', actingName);
            this.gameState.hero.acting = actingName === this.state.heroName;
            this.gameState.villain.acting = actingName === this.state.villainName;

            this.gameState.minBetAmount = tableState.round.minBetAmount;
            this.gameState.maxBetAmount = tableState.round.maxBetAmount;

            const button = tableState.button;
            console.assert(button != undefined, 'No button in tableState');
            this.gameState.button = button;
            console.assert(tableState.round.maxBet != undefined, 'tableState.round.maxBet  expected');
            this.gameState.maxBet = tableState.round.maxBet;
        }
        console.log('state updated');

        m.redraw();
    },
    updatePrivate: function(privateState) {
        this.gameState.hero.cards = privateState.cards;
        console.log('cards dealt: ', this.gameState.hero.cards);
        m.redraw();
    },
    updatePlayers: function(playersState) {
        this.newRound();
        this.state.gameStarted = false;
        console.log(playersState);
        const hero = playersState.find(p => p.name === this.state.heroName);
        console.assert(hero != undefined, `no ${this.state.heroName} in` + playersState);
        
        this.gameState.hero.stack = hero.stack;

        const villain = playersState.find(p => p.name != this.state.heroName);
        if (villain) {
            this.gameState.villain.stack = villain.stack;
            this.state.villainName = villain.name;
            this.state.canStart = true;
        }
        
        m.redraw();
    },
    message: function(msg) {

    },
    view: function(vnode) {
        console.assert(this.state != undefined && this.state != null);
        console.assert(this.socket != undefined);
        console.assert(this.gameState != undefined);

        console.assert(this.state.loggedIn != undefined, 'loggedId is undefined');
        console.assert(this.state.gameStarted != undefined, 'gameStarted is undefined');
        console.assert(this.state.tableId != undefined, 'tableId is undefined');
        console.assert(this.state.heroName != undefined, 'heroName is undefined');
        console.assert(this.state.villainName != undefined, 'villainName is undefined');
    
        return m('div', {class: 'bg-gray-100 h-screen'},
            m('div', {class: 'container mx-auto px-4 py-6'}, [
                m(title, {tableId: this.state.tableId}),
                !this.state.loggedIn && m(modal, {state: this.state, socket: this.socket}),
                // Game Table
                m('div', {class: 'relative max-w-2xl mx-auto mb-8 mt-20'}, [
                    m(villain, {villainName: this.state.villainName, villain: this.gameState.villain}),
                    m(pokerTable, {gameState: this.gameState}),
                    m(hero, {heroName: this.state.heroName, hero: this.gameState.hero})
                ]),
                this.state.gameStarted && this.gameState.hero.acting && 
                    m(actions, {gameState: this.gameState, state: this.state, socket: this.socket}),
                !this.state.gameStarted && m(startGame, {state: this.state, socket: this.socket})
            ])
        )
    },

};

m.mount(document.body, PokerTable);
