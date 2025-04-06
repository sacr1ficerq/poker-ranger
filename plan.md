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
        - Rewrite frontend in mithril.js (done)
        - Restrict users from entering with existing names (done)
        - Render combinations on showdown (done)
        - Fix bugs
        - New round start on client
        - Make decorator for extracting info from requests
        - Template sizings
        - flask_login
2. Skewed sampling (for preflop)
3. Game tree nodes

## Backend library

1. Basic poker (done)
    - Public and private states (done)
    - Showdown street (done)
    - Provide combinations on showdown (done)
    - Fix bugs: folds on preflop, checks on bb (done)
    - Add testing (done)
    - Add testing with Hand class e.g. line: 'r10.0cxb12.0f' hands: ... board:...
    - Fully conver functionality with tests
    - Fix all-ins
2. Skewed sampling
3. Game tree nodes
