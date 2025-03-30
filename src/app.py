from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO, emit, join_room, leave_room

import uuid

from pokergame import Table, Action

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# In-memory storage for tables TODO: move this logic to database
tables = {}
# TODO: store players and allow joining table with username


def generate_id():
    # Generate unique ID for the table
    table_id = str(uuid.uuid4())[:8]
    if table_id in tables:
        return generate_id()
    return table_id


@app.route('/')
def index():
    return render_template('index.html')


# interactions with server before table starts
@socketio.on('request_tables')
def send_available_tables():
    players = []
    for table in tables.values():
        players.append(len(table.players))
    emit('available_tables', {'tables': list(tables.keys()), 'players': players})


@app.route('/create_table')
def create_table():
    # username = data.get('username', 'unknown')
    # assert username != 'unknown', 'user unknown'

    # TODO: create table as logged in player with username and table admin capabilities
    # TODO: create tables with different stacksize/blinds/etc.
    sb = 1
    bb = 2
    table_id = generate_id()

    tables[table_id] = Table(table_id, sb, bb)
    return redirect(url_for('join_table', table_id=table_id))


@app.route('/table/<table_id>')
def join_table(table_id):
    if table_id not in tables:
        print(f'{table_id} not found in tables')
        return redirect(url_for('index'))
    return render_template('table.html', table_id=table_id)

# TODO: fix disconnect and connect (more that 2 players in lobby)


@socketio.on('join')
def on_join(data):
    sid = request.sid
    table_id = data.get('table_id')
    assert table_id, 'no table_id'
    if table_id not in tables:
        print(f'{table_id} not found in tables')
        return redirect(url_for('index'))

    assert table_id in tables, f'table {table_id} inaccesible'
    table = tables[table_id]

    player_name = data.get('player_name')
    assert player_name, 'no player_name'

    stack = data.get('stack', 200)
    assert stack >= 0, 'stack cant be negative'

    join_room(table_id)
    table.add_player(sid, player_name, stack)
    emit('message', f'{player_name} has joined the table', room=table_id)
    # player_states = list(map(lambda p: p.state(), table.players))
    player_states = [{'name': player.name, 'stack': player.stack} for player in table.players] 
    print('player states:', player_states)
    emit('players_update', player_states, room=table_id)


@socketio.on('disconnect')
def handle_disconnect():
    # Find which table the disconnected player was in
    for table_id, table in tables.items():
        for player in table.players:
            if player.id == request.sid:  # Compare session IDs
                player_name = player.name
                table.remove_player(player_name)
                leave_room(table_id)
                # Notify remaining players
                emit('message', f'{player_name} has disconnected', room=table_id)
                emit('players_update', table.state()['players'], room=table_id)

                # Optional: Handle table cleanup if empty
                if len(table.players) == 0:
                    tables.pop(table_id, None)
                    print(f"Table {table_id} removed (no players left)")
                break


@socketio.on('start_table')
def on_start(data):
    table_id = data.get('table_id')
    assert table_id, 'no table_id'
    assert table_id in tables, 'table_id now found in tables'

    player_name = data.get('player_name')
    assert player_name, 'no player_name'

    min_players = 2
    max_players = 2

    table = tables[table_id]

    assert len(table.players) >= min_players, 'not enough players to start the table'
    assert len(table.players) <= max_players, 'to many players'

    table.start_game()
    # emit('table_started', table.state(player_name), room=table_id)
    print(table.state())
    emit('table_update', table.state(), room=table_id)


# In table actions
@socketio.on('bet')
def on_bet(data):
    table_id = data.get('table_id')
    assert table_id, 'no table_id'
    assert table_id in tables

    player_name = data.get('player_name')
    assert player_name, 'no player_name'

    amount = data.get('amount')
    assert amount, 'no bet amount'
    assert amount >= 0, 'amount cant be nagative'
    action = Action.BET

    table = tables[table_id]

    table.act(action, player_name, amount)
    emit('table_update', table.state(), room=table_id)


if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
