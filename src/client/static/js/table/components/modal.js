const usernameForm = {
    oninit: function() {
        this.valid = false;
    },
    submit: function(username, state, socket) {
        console.assert(state.heroName != undefined, 'no heroName in state');
        console.log(state);
        console.assert(state.tableId != undefined, 'no tableId in state');
        state.heroName = username;
        state.loggedIn = true;
        socket.emit('join', { 
            tableId: state.tableId, 
            heroName: state.heroName 
        });
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
    view: function(vnode) {
        const state = vnode.attrs.state;
        console.assert(state, 'state expected');
        const socket = vnode.attrs.socket;
        console.assert(socket, 'socket expected');

        const villainName = state.villainName;
        console.assert(villainName, 'state.villainName expected');
        return m('form#username-form', {
            onsubmit: (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value.trim();
                console.assert(username != undefined, 'username element undefined');
                this.submit(username, state, socket);
            }
        }, [
            m('div', [
                m('label', {class: 'block text-sm text-gray-600 mb-2', for: 'username'}, 'Username'),
                m('input#username', {
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
                class: `w-full bg-gray-800 text-white py-2 rounded-lg ${this.valid? '' : 'disabled'}`,
                type: 'submit',
            }, 'Continue')
        ])
    }
}

export const modal = {
    view: function(vnode) {
        const state = vnode.attrs.state;
        console.assert(state, 'state expected');
        const socket = vnode.attrs.socket;
        console.assert(socket, 'socket expected');
        return m('#username-modal', 
            {class: 'fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10'}, [
            m('div', 
                {class: 'bg-white p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-100'}, [
                m('h2', {class: 'text-2xl font-light mb-4 text-gray-800'}, 'Enter Your Username'),
                m(usernameForm, {state, socket})
            ])
        ])
    }
}

