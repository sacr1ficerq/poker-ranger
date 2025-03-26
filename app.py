from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO, emit, join_room, leave_room

from game import Game

import uuid

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# In-memory storage for games TODO: move this logic to database
games = {} 
# TODO: store players and allow joining game with username

def generate_id():
    # Generate unique ID for the game
    game_id = str(uuid.uuid4())[:8]
    if game_id in games:
        return generate_id()
    return game_id


@app.route('/')
def index():
    return render_template('index.html')

# interactions with server before game starts
@socketio.on('request_games')
def send_available_games():
    players = []
    for game in games.values():
        players.append(len(game.players))
    emit('available_games', {'games': list(games.keys()), 'players': players})


@app.route('/create_game')
def create_game():
    # username = data.get('username', 'unknown')
    # assert username != 'unknown', 'user unknown'

    # TODO: create game as logged in player with username and game admin capabilities
    # TODO: create games with different stacksize/blinds/etc.
    game_id = generate_id()

    games[game_id] = Game(game_id)
    return redirect(url_for('join_game', game_id=game_id))


@app.route('/game/<game_id>')
def join_game(game_id):
    if game_id not in games:
        print(f'{game_id} not found in games')
        return redirect(url_for('index'))
    return render_template('game.html', game_id=game_id)

# TODO: fix disconnect and connect (more that 2 players in lobby)


@socketio.on('join')
def on_join(data):
    game_id = data.get('game_id')
    assert game_id, 'no game_id'
    if game_id not in games:
        print(f'{game_id} not found in games')
        return redirect(url_for('index'))

    assert game_id in games, f'game {game_id} inaccesible'
    game = games[game_id]

    player_name = data.get('player_name')
    assert player_name, 'no player_name'

    stack = data.get('stack', 200) 
    assert stack >= 0, 'stack cant be negative'

    join_room(game_id)
    game.new_player(player_name, stack)
    emit('message', f'{player_name} has joined the game', room=game_id)
    # player_states = list(map(lambda p: p.state(), game.players))
    player_states = [{'name': player.name, 'stack': player.stack} for player in game.players] 
    print('player states:', player_states)
    emit('players_update', player_states, room=game_id)


@socketio.on('start_game')
def on_start(data):
    game_id = data.get('game_id')
    assert game_id, 'no game_id'
    assert game_id in games, 'game_id now found in games'

    player_name = data.get('player_name')
    assert player_name, 'no player_name'

    min_players = 2

    game = games[game_id]

    assert game.n_players >= min_players, 'not enough players to start the game'

    game.start_game()
    emit('game_started', game.state(player_name), room=game_id)


# In game actions
@socketio.on('bet')
def on_bet(data):
    game_id = data.get('game_id')
    assert game_id, 'no game_id'
    assert game_id in games

    player_name = data.get('player_name')
    assert player_name, 'no player_name'

    amount = data.get('amount')
    assert amount, 'no bet amount'
    assert amount >= 0, 'amount cant be nagative'


    game = games[game_id]

    game.bet(player_name, amount)
    emit('game_update', game.state(player_name), room=game_id)


if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
