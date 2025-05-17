from flask import Flask, render_template, redirect, url_for, request
from flask_socketio import SocketIO, emit, join_room, leave_room

from game_manager import GameManager
from typing import List

import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

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
        # print(f'{table_id} not found in tables')
        logger.info(f'{table_id} not found in tables')
        return redirect(url_for('index'))
    return render_template('table.html', table_id=table_id)

@socketio.on('createTable')
def create_table(data):
    try:
        starting_pot = float(data['startingPot'])
        depth = float(data['depth'])

        preflop_spot = data['preflopSpot']
        in_position = data['inPosition']

        # print(f'spot: {preflop_spot}\t inpos: {in_position}')
        logger.info(f'spot: {preflop_spot}\t inpos: {in_position}')
        table = game_manager.create_game(starting_pot, depth, in_position, preflop_spot)
        emit('invite', {
            'tableId': table.id
        })
    except (KeyError, ValueError) as e:
        # print('error:', e)
        logger.error('error:', e)

# socketio events
@socketio.on('requestTables')
def send_available_tables():
    res: List[dict] = game_manager.get_games()
    emit('updateTables', {'tables': res})


# function thats called after player connected and entering range and name
@socketio.on('requestGame')
def send_game(data):
    table_id = data.get('tableId')
    assert table_id, 'no tableId'

    if not game_manager.exists(table_id):
        # print(f'{table_id} not found in tables')
        logger.info(f'{table_id} not found in tables')

        return redirect(url_for('index'))

    players: List[dict] = game_manager.get_players(table_id)
    game = game_manager.get_game_data(table_id)

    # print('players: ', players)
    logger.info('players: ', players)
    emit('playersUpdate', players)

    game = game_manager.get_game_data(table_id)
    # print('game: ', game)
    logger.info('game: %s', game)
    emit('gameUpdate', game)


@socketio.on('requestPrivate')
def send_private(data):
    sid: str = request.sid # type: ignore[attr-defined]
    table_id = data.get('tableId')
    assert table_id is not None, 'no tableId'

    hero_name = data.get('heroName')
    assert hero_name, 'no heroName'

    res = game_manager.get_private(table_id, player_name=hero_name)
    if res is None:
        print(f'{table_id} not found in tables')
        return redirect(url_for('index'))

    emit('privateUpdate', res, room=sid) # type: ignore[attr-defined]


def deal(game_id):
    assert game_manager.exists(game_id)
    for player in game_manager.get_players(game_id):
        res = game_manager.get_private(game_id, player['name'])
        emit('privateUpdate', res, room=player['id']) # type: ignore[attr-defined]


@socketio.on('join')
def on_join(data):
    sid = request.sid # type: ignore[attr-defined]
    table_id = data.get('tableId')
    assert table_id, 'no tableId'

    if not game_manager.exists(table_id):
        # print(f'{table_id} not found in tables')
        logger.info(f'{table_id} not found in tables')
        return redirect(url_for('index'))

    name = data.get('heroName')
    assert name is not None, 'no heroName'

    stack = data.get('stack', None)

    preflop_range:List[List[float]] | None = data.get('preflopRange')
    assert preflop_range is not None, 'no preflopRange'

    game_manager.add_player(table_id, sid, name, preflop_range, stack)
    join_room(table_id)
    emit('message', f'{name} has joined the table', room=table_id) # type: ignore[attr-defined]

    players = game_manager.get_players(table_id)
    # print('player states:', players)
    logger.info('player states:', players)
    emit('playersUpdate', players, room=table_id) # type: ignore[attr-defined]

    game = game_manager.get_game_data(table_id)
    # print('game: ', game)
    logger.info('game: ', game)
    emit('gameUpdate', {'game': game})


# for now just remove player from all rooms after single disconnect
@socketio.on('disconnect')
def handle_disconnect():
    player_id = request.sid # type: ignore[attr-defined]
    rooms = game_manager.get_rooms(player_id)
    # print(f"Player disconnecting from rooms: {rooms}")
    logger.info(f"Player disconnecting from rooms: {rooms}")

    for game_id in rooms:
        leave_room(room=game_id, sid=player_id)
        if game_manager.exists(game_id):
            player_name = game_manager.disconnect(player_id, game_id)
            msg = f'{player_name} has disconnected'
            emit('message', msg, room=table_id) # type: ignore[attr-defined]
            res = game_manager.get_players(game_id)
            emit('playersUpdate', res, room=table_id) # type: ignore[attr-defined]


@socketio.on('startTable')
def on_start(data):
    table_id = data.get('tableId')
    assert table_id, 'no tableId'

    assert game_manager.exists(table_id), f'{table_id} not found in tables'
    emit('gameStarted', room=table_id) # type: ignore[attr-defined]

    game_manager.start_game(table_id)

    emit('newRound', room=table_id) # type: ignore[attr-defined]
    deal(table_id)

    res: dict = game_manager.get_table_data(table_id)
    emit('tableUpdate', res, room=table_id) # type: ignore[attr-defined]


@socketio.on('startRound')
def start_round(data):
    table_id = data.get('tableId')
    hero_name = data.get('heroName')

    assert table_id, 'no tableId'
    assert game_manager.exists(table_id), 'tableId not found in tables'
    assert hero_name, 'no heroName'

    game_manager.start_round(table_id)

    emit('newRound', room=table_id) # type: ignore[attr-defined]
    deal(table_id)
    res: dict = game_manager.get_table_data(table_id)
    emit('tableUpdate', res, room=table_id) # type: ignore[attr-defined]


@socketio.on('action')
def on_action(data):
    try:
        table_id = data['tableId']
        assert game_manager.exists(table_id), 'tableId not found in tables'

        hero_name = data['heroName']
        amount = float(data['amount'])

        assert amount >= 0, 'amount cant be nagative'

        action = data['action']
        assert action, 'no action'

    except (KeyError, ValueError) as e:
        # print('error:', e)
        logger.error('error:', e)
        return

    game_manager.action(table_id, hero_name, amount, action)

    res: dict = game_manager.get_table_data(table_id)
    emit('tableUpdate', res, room=table_id) # type: ignore[attr-defined]


if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
