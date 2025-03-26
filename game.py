import pokergame

class Game:
    def __init__(self, id):
        self.table = pokergame.Table(sb=1, bb=2)
        self.id = id
        self.players = []
        print(f'Game {id} created!')

    def bet(self, player_name, amount):
        print(f'Player \'{player_name}\' bets {amount}')
    
    def check(self, player_name):
        print(f'Player \'{player_name}\' bets {amount}')

    def fold(self, player_name):
        print(f'Player \'{player_name}\' bets {amount}')

    def new_player(self, player_name, stack):
        print(f'New player \'{player_name}\' buys in for {stack}')
        player = pokergame.Player(player_name, stack, self.table)
        self.players.append(player)
        self.table.add_player(player)
    
    def state(self, player_name):
        return self.table.state(player_name)

    def start_game(self):
        print('Game starts!')