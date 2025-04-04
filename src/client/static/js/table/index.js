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
}

export const PokerTable = {
    socket: null,
    state: {
        tableId: 'None',
        heroName: 'Anonymous',
        villainName: 'Anonymous',
        loggedIn: false,
        gameStarted: true
    },
    gameState: {
        pot: 0,
        acting: '',
        minBetAmount: 2,
        maxBetAmount: 0,
        board: [],
        round: {
            maxBet: 0,
        },

        heroBet: 0,
        villainBet: 0,

        maxBet: 1,
    },
    oninit: function() {
        // const pathSegments = window.location.pathname.split('/');
        // this.state.tableId = pathSegments[pathSegments.length - 1];
        this.socket = window.io();
        handle(this.socket, this);
    },
    startGame: function() {

    },
    newRound: function() {

    },
    update: function(tableState) {

    },
    updatePrivate: function(privateState) {

    },
    updatePlayers: function(playersState) {

    },
    message: function(msg) {

    },
    view: function() {
        console.assert(this.state != undefined && this.state != null);
        console.assert(this.socket != undefined);
        console.assert(this.gameState != undefined);

        console.assert(this.state.loggedIn != undefined, 'loggedId is undefined');
        console.assert(this.state.gameStarted != undefined, 'gameStarted is undefined');
        console.assert(this.state.tableId != undefined, 'tableId is undefined');
        console.assert(this.state.heroName != undefined, 'heroName is undefined');
        console.assert(this.state.villainName != undefined, 'villainName is undefined');

        const gameStarted = this.state.gameStarted;
        return m('div', {class: 'bg-gray-100 h-screen'},
            m('div', {class: 'container mx-auto px-4 py-6'}, [
                m(title, {tableId: this.state.tableId}),
                !this.state.loggedIn && m(modal, {state: this.state, socket: this.socket}),
                // Game Table
                m('div', {class: 'relative max-w-2xl mx-auto mb-8 mt-20'}, [
                    m(villain, {villainName: this.state.villainName}),
                    m(pokerTable, {gameState: this.gameState}),
                    m(hero, {heroName: this.state.heroName})
                ]),
                gameStarted && m(actions, {gameState: this.gameState, state: this.state, socket: this.socket}),
                !gameStarted && m(startGame, {state: this.state, socket: this.socket})
            ])
        )
    },

};

m.mount(document.body, PokerTable);
