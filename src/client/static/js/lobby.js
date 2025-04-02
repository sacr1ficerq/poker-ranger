document.addEventListener('DOMContentLoaded', function() {
    const elements = {
        refresh_btn: document.getElementById('refresh-btn'),
        lobby_container: document.querySelector('.divide-y') // Container for lobby items
    };

    const socket = io();
    
    function rendertables(data) {
        // Clear existing content
        elements.lobby_container.innerHTML = '';
        
        if (data.tables.length === 0) {
            // Show empty state
            elements.lobby_container.innerHTML = `
                <div class="px-6 py-8 text-center text-gray-500">
                    No active tables available. Create one to start playing!
                </div>
            `;
            return;
        }

        // Create lobby items for each table
        data.tables.forEach((table_id, index) => {
            const player_count = data.players[index];
            const max_players = 2; // Assuming 2 max players per table
            const is_full = player_count >= max_players;

            const element = document.createElement('div');
            element.className = 'grid grid-cols-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors';
            element.innerHTML = `
                <div class="font-mono text-gray-600">#${table_id}</div>
                <div>${player_count}/${max_players} players</div>
                <div>
                    <span class="px-2 py-1 ${is_full ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-600'} rounded-full text-sm">
                        ${is_full ? 'Full' : 'Waiting'}
                    </span>
                </div>
                <div>
                    ${is_full ? 
                        '<div class="text-gray-400">Closed</div>' : 
                        `<a href="/table/${table_id}" class="text-green-500 hover:text-green-600 font-medium">Join</a>`
                    }
                </div>
            `;

            elements.lobby_container.appendChild(element);
        });
    }

    // Initial tables request
    socket.emit('request_tables');

    // Handle tables response
    socket.on('available_tables', (data) => {
        console.log('Available tables:', data.tables);
        rendertables(data);
    });

    // Refresh button handler
    elements.refresh_btn.addEventListener('click', () => {
        socket.emit('request_tables');
        console.log('Refreshing lobby...');
    });

    // Optional: Auto-refresh every 10 seconds
    setInterval(() => socket.emit('request_tables'), 10000);
});