# Course work MVP plan

## Client

### Basic Poker
#### Lobby (done)
- Client renderiing of all available rooms with refresh (done)
- Rewrite lobby in mithril.js (done)
#### Room
- Client rendering of room: players, room_id (done)
- Handling disconnect properly (done)
- Client rendering of game state (done)
- Showdown rendering (done)
- Rewrite room in mithril.js (done)
- Restrict users from entering with existing names (done)
- Render combinations on showdown (done)
- New round start on client (done)
- Move button
- Remove broke players
- Convert raise sized from delta to absolute
- Fix bugs
- Template sizings
- Results table
- Nicer UI
- Hide zero bets and pot
### Skewed sampling (for preflop)
### Game tree nodes

### Cosmetics (optional)
- Logo
- Dark gray + gold color scheme
- Activate input field by default
- JS testing
- Main page with desciption and link to lobby
- Add last action on player
- Loading into existing disconnected player with same name
- Hints
- New state for winning + all_in
- Animations with regulated speed
- Table sprite + bg sprite
- Dark theme
- Luckinnes
- Chat for messages


## Server

### Basic Poker
#### Lobby (done)
- Server route for getting all rooms (done)
- Server route for creating room (done)
#### Room
- Server route for starting game (done)
- Handling disconnect properly (done)
- Server routes for in game actions (done)
- Restrict users from entering with existing names (done)
- Move button
- Template sizings
- Results table
### Skewed sampling (for preflop)
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
