class lobbyHeader {
    constructor(vnode) {
        console.log(vnode);
        this.refresh = vnode.attrs.refresh;
    }

    view() {
        return m('div', {class: 'medium bg-gray-50 grid grid-cols-4 text-gray-500'}, [
            m('div', 'Table ID'),
            m('div', 'Players'),
            m('div', 'Status'),
            m('div', m('button', {
                onclick: () => {console.log('refresh'); this.refresh()}, 
                class: 'text-blue-500 hover:text-blue-600 px-0 bg-transparent shadow-none text-left'}, 
                'Refresh'))])
    }
};

const empty = m('div', {class: 'px-6 py-8 text-center text-gray-500'}, 'No active tables');

class lobbyItem {
    view(vnode) {
        return m('div.lobby-item', {key: vnode.attrs.id}, [
            m('div', {class: 'font-mono text-gray-600'}, `#${vnode.attrs.id}`),
            m('div', `${vnode.attrs.players}/2 players`),
            vnode.attrs.players === 2 ? 
            m('div', m('span', {class: 'bg-gray-100 text-gray-600 rounded-full small'}, 'Full')) : 
            m('div', m('span', {class: 'bg-green-100 text-green-600 rounded-full small'}, 'Waiting')),

            vnode.attrs.players === 2 ? 
            m('div', {class: 'text-gray-400'}, 'Closed') :
            m('div', 
                m('a', 
                    {class: 'font-medium text-green-500 hover:text-green-600', href: `/table/${vnode.attrs.id}`}, 
                    'Join'))
        ])
    }
}

class lobbyItems {
    view(vnode) {
        vnode.attrs.tables.sort((a, b) => a.players - b.players);
        return m('div', {class: 'divide-y divide-gray-100'}, 
            vnode.attrs.tables.length === 0?
            empty : vnode.attrs.tables.map((table) => m(lobbyItem, {key: table.id, id: table.id, players: table.players}))
        )
    }
}

export class lobbyList{
    view(vnode) {
        return m('div', {class: 'bg-white rounded-xl shadow-md overflow-hidden'}, 
            [m(lobbyHeader, {refresh: vnode.attrs.refresh}), m(lobbyItems, {tables: vnode.attrs.tables})])
    }
}
