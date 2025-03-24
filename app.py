from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO, emit, join_room, leave_room

from game import Game
import random

app = Flask(__name__, static_folder='static', static_url_path='/static')
socketio = SocketIO(app)

games = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create_game')
def create_game():
    game_id = str(random.randint(1000, 9999))
    games[game_id] = Game(game_id)
    return redirect(url_for('join_game', game_id=game_id))


@app.route('/game/<game_id>')
def join_game(game_id):
    if game_id not in games:
        return redirect(url_for('index'))
    return render_template('game.html', game_id=game_id)


@socketio.on('join')
def on_join(data):
    game_id = data['game_id']
    player_name = data['player']

    if game_id in games:
        join_room(game_id)
        games[game_id].new_player(player_name, 200)
        emit('message', f'{player_name} has joined the game', room=game_id)
        emit('update_players', games[game_id].players, room=game_id)


@socketio.on('start_game')
def on_start(data):
    game_id = data['game_id']
    player_name = data['player']
    if game_id in games and len(games[game_id]['players']) >= 2:
        # games[game_id]['state'] = 'preflop'
        # Initialize deck, deal cards, etc.
        games[game_id].start_game()
        emit('game_started', games[game_id].state(player_name), room=game_id)


@socketio.on('bet')
def on_bet(data):
    game_id = data['game_id']
    amount = data['amount']
    player_name = data['player']

    game = games[game_id]
    # Update game state 
    game.bet(player_name, amount)

    emit('game_update', games[game_id].state(player_name), room=game_id)


if __name__ == '__main__':
    socketio.run(app, debug=True)
