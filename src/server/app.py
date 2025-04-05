from flask import Flask, render_template, request, redirect, url_for
from flask_socketio import SocketIO, emit, join_room, leave_room

import uuid

from pokergame import Table, Action

app = Flask(
  __name__,
  static_folder='../client/static/',
  template_folder='../client/templates/'
)

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


# Routes
@app.route('/')
def index():
    return render_template('index.html')


# TODO: create table as logged in player with username and table admin capabilities
@app.route('/create_table')
def create_table():
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


# socketio events
@socketio.on('requestTables')
def send_available_tables():
    res = list(map(lambda id:
                   {'players': len(tables[id].players),
                    'id': id},
                   tables.keys()))
    emit('updateTables', {'tables': res})


@socketio.on('requestNames')
def send_players(data):
    table_id = data.get('tableId')
    assert table_id, 'no tableId'
    if table_id not in tables:
        print(f'{table_id} not found in tables')

    assert table_id in tables, f'table {table_id} inaccesible'
    table = tables[table_id]

    res = list(map(lambda p: p.name, table.players))
    print('players:', res)
    emit('updateNames', {'players': res})


@socketio.on('requestPrivate')
def send_private(data):
    sid = request.sid
    table_id = data.get('tableId')
    assert table_id is not None, 'no tableId'
    if table_id not in tables:
        print(f'{table_id} not found in tables')
        return redirect(url_for('index'))

    assert table_id in tables, f'table {table_id} inaccesible'
    table = tables[table_id]

    hero_name = data.get('heroName')
    assert hero_name, 'no heroName'

    stack = data.get('stack', 200)
    assert stack >= 0, 'stack cant be negative'

    res = table.private_state(hero_name)
    emit('privateUpdate', res, room=sid)


def deal(table_id):
    assert table_id in tables
    table = tables[table_id]
    for player in table.players:
        res = table.private_state(player.name)
        emit('privateUpdate', res, room=player.id)


@socketio.on('join')
def on_join(data):
    sid = request.sid
    table_id = data.get('tableId')
    assert table_id, 'no tableId'
    if table_id not in tables:
        print(f'{table_id} not found in tables')
        return redirect(url_for('index'))

    assert table_id in tables, f'table {table_id} inaccesible'
    table = tables[table_id]

    hero_name = data.get('heroName')
    assert hero_name is not None, 'no heroName'

    stack = data.get('stack', 200)
    assert stack >= 0, 'stack cant be negative'

    join_room(table_id)
    table.add_player(sid, hero_name, stack)
    emit('message', f'{hero_name} has joined the table', room=table_id)
    # player_states = list(map(lambda p: p.state(), table.players))
    player_states = [{'name': player.name, 'stack': player.stack}
                     for player in table.players]
    print('player states:', player_states)
    emit('playersUpdate', player_states, room=table_id)


@socketio.on('disconnect')
def handle_disconnect():
    # Find which table the disconnected player was in
    for table_id, table in tables.items():
        for player in table.players:
            if player.id == request.sid:  # Compare session IDs
                hero_name = player.name
                table.remove_player(hero_name)
                leave_room(table_id)
                emit('message', f'{hero_name} has disconnected', room=table_id)
                emit('playersUpdate', table.state()['players'], room=table_id)

                if len(table.players) == 0:
                    tables.pop(table_id, None)
                    assert table_id not in tables
                    print(f"Table {table_id} removed (no players left)")
                break


@socketio.on('startTable')
def on_start(data):
    table_id = data.get('tableId')
    assert table_id, 'no tableId'
    assert table_id in tables, f'{table_id} not found in tables'
    emit('gameStart', room=table_id)
    start_round(data)


@socketio.on('startRound')
def start_round(data):
    table_id = data.get('tableId')
    assert table_id, 'no tableId'
    assert table_id in tables, 'tableId not found in tables'

    hero_name = data.get('heroName')
    assert hero_name, 'no heroName'

    min_players = 2
    max_players = 2

    table = tables[table_id]

    n = len(table.players)
    assert n >= min_players, 'not enough players to start the round'
    assert n <= max_players, 'to many players'

    table.new_round()
    # emit('table_started', table.state(hero_name), room=table_id)
    print(table.state())
    deal(table_id)

    emit('newRound', room=table_id)
    emit('tableUpdate', table.state(), room=table_id)


@socketio.on('action')
def on_action(data):
    table_id = data.get('tableId')
    assert table_id, 'no tableId'
    assert table_id in tables

    hero_name = data.get('heroName')
    assert hero_name, 'no heroName'

    amount = data.get('amount')
    assert amount is not None, 'no amount'

    try:
        amount = float(amount)
    except ValueError:
        assert False, 'amount is not convertible'

    assert amount >= 0, 'amount cant be nagative'

    action = data.get('action')
    assert action, 'no action'

    d = {'bet': Action.BET,
         'check': Action.CHECK,
         'call': Action.CALL,
         'raise': Action.RAISE,
         'fold': Action.FOLD}

    table = tables[table_id]
    print(hero_name, action, amount)

    table.act(d[action], hero_name, amount)
    emit('tableUpdate', table.state(), room=table_id)


if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
