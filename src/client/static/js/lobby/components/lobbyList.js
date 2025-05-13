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
    view({attrs}) {
        const {id, playerAmount} = attrs;
        return m('div.lobby-item', {key: id}, [
            m('div', {class: 'font-mono text-gray-600'}, `#${id}`),
            m('div', `${playerAmount}/2 players`),
            playerAmount === 2 ? 
            m('div', m('span', {class: 'bg-gray-100 text-gray-600 rounded-full small'}, 'Full')) : 
            m('div', m('span', {class: 'bg-green-100 text-green-600 rounded-full small'}, 'Waiting')),

            playerAmount === 2 ? 
            m('div', {class: 'text-gray-400'}, 'Closed') :
            m('div', 
                m('a', 
                    {class: 'font-medium text-green-500 hover:text-green-600', href: `/table/${id}`}, 
                    'Join'))
        ])
    }
}

class lobbyItems {
    view({attrs}) {
        attrs.tables.sort((a, b) => a.players - b.players);
        return m('div', {class: 'divide-y divide-gray-100'}, 
            attrs.tables.length === 0?
            empty : attrs.tables.map((table) => m(lobbyItem, {key: table.id, id: table.id, playerAmount: table.playerAmount}))
        )
    }
}

export class lobbyList{
    view(vnode) {
        return m('div', {class: 'bg-white rounded-xl shadow-md overflow-hidden'}, 
            [m(lobbyHeader, {refresh: vnode.attrs.refresh}), m(lobbyItems, {tables: vnode.attrs.tables})])
    }
}
