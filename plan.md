# Course work MVP plan

## Client + Server

1. Basic Poker
    - Lobby (done)
        - Server route for getting all rooms (done)
        - Client renderiing of all available rooms with refresh (done)
        - Server route for creating room (done)
    - Room
        - Client rendering of room: players, room_id (done)
        - Server route for starting game (done)
        - Handling disconnect properly (done)
        - Client rendering of game state (done)
        - Server routes for in game actions (done)
        - Showdown rendering (done)
        - Fix bugs
        - Restrict users from entering with existing names
        - New round start on client
        - Render combinations on showdown
        - Make decorator for extracting info from requests
        - Template sizings
        - flask_login
2. Skewed sampling (for preflop)
3. Game tree nodes

## Backend library

1. Basic poker (done)
    - Public and private states (done)
    - Showdown street (done)
    - Provide combinations on showdown
    - Fix bugs: folds on preflop, checks on bb
    - Add all-ins
2. Skewed sampling
3. Game tree nodes
