from flask import Flask, render_template, request, redirect, url_for
from flask_socketio import SocketIO, emit, join_room, leave_room

from game_manager import GameManager

from typing import List


app = Flask(
    __name__,
    static_folder='../client/static/',
    template_folder='../client/templates/'
)

socketio = SocketIO(app, cors_allowed_origins="*")

game_manager: GameManager = GameManager()


# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/table/<table_id>')
def join_table(table_id):
    if not game_manager.exists(table_id):
        print(f'{table_id} not found in tables')
        return redirect(url_for('index'))
    return render_template('table.html', table_id=table_id)

@socketio.on('createTable')
def create_table(data):
    try:
        starting_pot = float(data['startingPot'])
        depth = float(data['depth'])
        
        table = game_manager.create_table(starting_pot, depth)
        emit('invite', {
            'tableId': table.id
        })
    except (KeyError, ValueError) as e:
        print('error')


# socketio events
@socketio.on('requestTables')
def send_available_tables():
    res = game_manager.get_tables()
    emit('updateTables', {'tables': res})


@socketio.on('requestNames')
def send_players(data):
    table_id = data.get('tableId')
    assert table_id, 'no tableId'

    if not game_manager.exists(table_id):
        print(f'{table_id} not found in tables')
        return redirect(url_for('index'))

    res = game_manager.get_players(table_id)
    emit('updateNames', {'players': res})


@socketio.on('requestPrivate')
def send_private(data):
    sid = request.sid
    table_id = data.get('tableId')
    assert table_id is not None, 'no tableId'

    hero_name = data.get('heroName')
    assert hero_name, 'no heroName'

    res = game_manager.get_private(table_id, player_name=hero_name)
    if res is None:
        print(f'{table_id} not found in tables')
        return redirect(url_for('index'))

    emit('privateUpdate', res, room=sid)


def deal(table_id):
    assert game_manager.exists(table_id)
    table = game_manager.get_table(table_id)
    for player in table.players:
        res = table.private_data(player.name)
        emit('privateUpdate', res, room=player.id)


@socketio.on('join')
def on_join(data):
    sid = request.sid
    table_id = data.get('tableId')
    assert table_id, 'no tableId'

    if not game_manager.exists(table_id):
        print(f'{table_id} not found in tables')
        return redirect(url_for('index'))

    name = data.get('heroName')
    assert name is not None, 'no heroName'

    stack = data.get('stack', 100)
    assert stack >= 0, 'stack cant be negative'

    preflop_range:List[List[str]] | None = data.get('preflopRange')
    assert preflop_range is not None, 'no preflopRange'

    game_manager.add_player(table_id, sid, name, stack, preflop_range)
    join_room(table_id)
    emit('message', f'{name} has joined the table', room=table_id)

    res = game_manager.get_player_states(table_id)
    print('player states:', res)
    emit('playersUpdate', res, room=table_id)


@socketio.on('disconnect')
def handle_disconnect():
    id = request.sid
    table_id, player = game_manager.disconnect(id)
    if table_id is not None and player is not None:
        return

    leave_room(table_id)
    if game_manager.exists(table_id):
        msg = f'{player.name} has disconnected'
        emit('message', msg, room=table_id)
        res = game_manager.get_player_states(table_id)
        emit('playersUpdate', res, room=table_id)


@socketio.on('startTable')
def on_start(data):
    table_id = data.get('tableId')
    assert table_id, 'no tableId'

    assert game_manager.exists(table_id), f'{table_id} not found in tables'
    emit('gameStarted', room=table_id)

    game_manager.start_table(table_id)

    emit('newRound', room=table_id)
    deal(table_id)

    res = game_manager.get_table_data(table_id)
    emit('tableUpdate', res, room=table_id)


@socketio.on('startRound')
def start_round(data):
    table_id = data.get('tableId')
    hero_name = data.get('heroName')

    assert table_id, 'no tableId'
    assert game_manager.exists(table_id), 'tableId not found in tables'
    assert hero_name, 'no heroName'

    game_manager.start_round(table_id)

    emit('newRound', room=table_id)
    deal(table_id)
    res = game_manager.get_table_data(table_id)
    emit('tableUpdate', res, room=table_id)


@socketio.on('action')
def on_action(data):
    table_id = data.get('tableId')
    assert table_id, 'no tableId'
    assert game_manager.exists(table_id), 'tableId not found in tables'

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

    game_manager.action(table_id, hero_name, amount, action)

    res = game_manager.get_table_data(table_id)
    emit('tableUpdate', res, room=table_id)


if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
