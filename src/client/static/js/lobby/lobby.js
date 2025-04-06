import { lobbyList } from "./components/lobbyList.js"

const Lobby = {
    tables: [],
    socket: window.io(),

    renderTables: (tables) => {
        Lobby.tables = tables;
        m.redraw();
        console.log(tables);
    },

    oninit: () => {
        Lobby.socket.on('updateTables', (data) => {
            Lobby.renderTables(data.tables);
        });
        Lobby.socket.emit('requestTables');
        setInterval(() => Lobby.socket.emit('requestTables'), 10000);
    },

    view: () => {
        const title = m('div', {class:'div flex items-center justify-between mb-8'}, [
            m('h1', {class: 'text-4xl font-bold text-gray-800'}, 'Poker lobby'),
            m('a', {class: 'btn-nice medium rounded-lg', href: '/create_table'}, 'New table')
        ]);

        const refresh = () => {
            Lobby.socket.emit('requestTables');
            console.log('Refreshing lobby...');
        }

        const container = m('div', {class: 'container mx-auto px-4 py-8 max-w-4xl'}, [
            title, 
            m(lobbyList, {tables: Lobby.tables, refresh: refresh})
        ]);

        return m('div', {class: 'min-h-screen bg-gray-100'}, container)
    }
}

m.mount(document.body, Lobby);
