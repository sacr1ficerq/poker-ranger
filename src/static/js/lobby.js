document.addEventListener('DOMContentLoaded', function() {
    const elements = {
        refresh_btn: document.getElementById('refresh-btn'),
        lobby_container: document.querySelector('.divide-y') // Container for lobby items
    };

    const socket = io();
    
    function renderGames(data) {
        // Clear existing content
        elements.lobby_container.innerHTML = '';
        
        if (data.games.length === 0) {
            // Show empty state
            elements.lobby_container.innerHTML = `
                <div class="px-6 py-8 text-center text-gray-500">
                    No active games available. Create one to start playing!
                </div>
            `;
            return;
        }

        // Create lobby items for each game
        data.games.forEach((gameId, index) => {
            const playerCount = data.players[index];
            const maxPlayers = 2; // Assuming 2 max players per game
            const isFull = playerCount >= maxPlayers;

            const gameElement = document.createElement('div');
            gameElement.className = 'grid grid-cols-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors';
            gameElement.innerHTML = `
                <div class="font-mono text-gray-600">#${gameId}</div>
                <div>${playerCount}/${maxPlayers} players</div>
                <div>
                    <span class="px-2 py-1 ${isFull ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-600'} rounded-full text-sm">
                        ${isFull ? 'Full' : 'Waiting'}
                    </span>
                </div>
                <div>
                    ${isFull ? 
                        '<div class="text-gray-400">Closed</div>' : 
                        `<a href="/game/${gameId}" class="text-green-500 hover:text-green-600 font-medium">Join</a>`
                    }
                </div>
            `;

            elements.lobby_container.appendChild(gameElement);
        });
    }

    // Initial games request
    socket.emit('request_games');

    // Handle games response
    socket.on('available_games', (data) => {
        console.log('Available games:', data.games);
        renderGames(data);
    });

    // Refresh button handler
    elements.refresh_btn.addEventListener('click', () => {
        socket.emit('request_games');
        console.log('Refreshing lobby...');
    });

    // Optional: Auto-refresh every 10 seconds
    setInterval(() => socket.emit('request_games'), 10000);
});