# Course work MVP plan

## Client

### Basic Poker
#### Lobby (done)
- Rendering of all available rooms with refresh (done)
- Rewrite lobby in mithril.js (done)
#### Room
- Rendering of room: players, room_id (done)
- Handling disconnect properly (done)
- Rendering of game state (done)
- Showdown rendering (done)
- Rewrite room in mithril.js (done)
- Restrict users from entering with existing names (done)
- Render combinations on showdown (done)
- New round start on client (done)
- Move button
- Convert raise sized from delta to absolute
- Fix bugs
- Template sizings
- Results table
- Nicer UI
- Hide zero bets and pot

### Skewed sampling (for preflop)
#### Room
- Player connecting and selecting range after modal (done)
- Starting game with starting pot size
- Add templates for different preflop situations

### Game tree nodes

### Cosmetics (optional)
- Logo
- Dark gray + gold color scheme or rose-pine?
- Activate input field by default
- JS testing
- Main page with desciption and link to lobby
- Add last action on player
- Loading into existing disconnected player with same name
- Remove broke players
- Hints
- New state for winning + all_in
- Animations with regulated speed
- Table sprite + bg sprite
- Dark/Light theme
- Luckinnes
- Chat for messages
- Add abilty to change preflop range mid hand?
- Add starting pot templates
- Add starting pot input validation
- Add red border after wrong input

## Server

### Basic Poker
#### Lobby (done)
- Server route for getting all rooms (done)
- Server route for creating room (done)
#### Room
- Route for starting game (done)
- Handling disconnect properly (done)
- Routes for in game actions (done)
- Restrict users from entering with existing names (done)
- Route for fetching results table

### Skewed sampling (for preflop)
#### Room
- Route for starting game with starting pot size
- Routes for player connecting and selecting range

### Game tree nodes

### Cosmetics (optional)
- Make decorator for extracting info from requests
- Incapsulate data extraction in game_manager 
- Try/except assertion error in app.py
- Create tables with different stacksize/blinds/etc.
- Move game_manager tables interation to database
- Main page with desciption and link to lobby
- Add last action on player
- Loading into existing disconnected player with same name
- Flask_login
- New state for winning + all_in
- Luckinnes
- Chat for messages
