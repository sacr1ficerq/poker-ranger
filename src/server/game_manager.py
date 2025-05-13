from dataclasses import dataclass, asdict
from typing import List, Tuple, Dict
import uuid
import numpy as np

from pokergame import Table, Action, Player, Range



@dataclass
class PreflopType:
    # '3bet BUTvsBB 6max 100bb'
    type: str
    positions: str
    tableSize: str
    depth: float
    starting_pot: float

    def __repr__(self) -> str:
        return f"{self.type} {self.positions} {self.tableSize} {self.depth}bb"

class PreflopSpot:
    def __init__(self, 
                 starting_pot: float, 
                 depth: float, 
                 button_moves: bool = False, 
                 edit_ranges: bool = True, 
                 range_ip: Range | None = None, 
                 range_oop: Range | None = None):
        self.starting_pot = starting_pot
        self.depth = depth

        self.button_moves = button_moves
        self.edit_ranges = edit_ranges

        self.range_ip = range_ip
        self.range_oop = range_oop

        assert edit_ranges or (range_ip is not None and range_oop is not None)

    
    def with_type(self, preflop_type: PreflopType):
        self.starting_pot = preflop_type.starting_pot
        self.depth = preflop_type.depth - preflop_type.starting_pot / 2
        
        self.range_oop, self.range_ip = ranges[str(preflop_type)]
        
oop = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 1.0, 0.0, 0.0, 0.0, 0.0],  # AA, AKs...A2s
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 1.0, 0.5, 0.0, 0.0, 0.5],  # AKo, KK...K2s
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0],  # AQo, KQo...Q2s
    [0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0],  # AJo, KJo...J2s
    [0.0, 0.5, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.5, 1.0, 0.5, 0.5, 0.5],  # ATo, KTo...T2s
    [0.5, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0],  # A9o, K9o...92s
    [0.5, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.5, 0.5, 0.0, 0.0],  # A8o, K8o...82s
    [1.0, 1.0, 1.0, 0.5, 0.0, 0.0, 1.0, 0.0, 1.0, 0.5, 0.5, 1.0, 0.0],  # A7o, K7o...72s
    [1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.5, 1.0, 0.5, 1.0, 0.0],  # A6o, K6o...62s
    [1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.5, 0.5],  # A5o, K5o...52s
    [1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0],  # A4o, K4o...42s
    [1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0],  # A3o, K3o...32s
    [1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0]   # A2o, K2o...22
]

ip = [
    [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],  # AA, AKs...A2s
    [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],  # AKo, KK...K2s
    [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],  # AQo, KQo...Q2s
    [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],  # AJo, KJo...J2s
    [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],  # ATo, KTo...T2s
    [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],  # A9o, K9o...92s
    [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],  # A8o, K8o...82s
    [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],  # A7o, K7o...72s
    [1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],  # A6o, K6o...62s
    [1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0],  # A5o, K5o...52s
    [1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0],  # A4o, K4o...42s
    [1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0],  # A3o, K3o...32s
    [1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0]   # A2o, K2o...22
]

ranges: Dict[str, Tuple[Range, Range]] = {}
# SRP BBvsBUT 6max 100bb
base = PreflopType('SRP', 'BUTvsBB', 'HU', 2.5 * 2, 100)
ranges[str(base)] = (
        Range(np.array(oop)),
        Range(np.array(ip)),
)

@dataclass
class GameData:
    id: str
    type: str
    adminIP: bool
    playerAmount: int
    playerNames: List[str]
    rangeIP: List[List[float]] | None = None
    rangeOOP: List[List[float]] | None = None


@dataclass
class PlayerData:
    id: str
    name: str
    stack: float
    preflopRange: List[List[float]]


class Game:
    def __init__(self, id: str, preflop_type: str, admin_ip: bool, table: Table, range_oop: Range|None=None, range_ip: Range|None=None):
        self.id = id
        self.prefop_type = preflop_type
        self.admin_ip = admin_ip
        self.table = table
        self.range_ip = range_ip
        self.range_oop = range_oop

    def data(self) -> GameData:
        names = list(map(lambda p: p.name, self.table.players))
        if self.range_ip is None or self.range_oop is None:
            return GameData(self.id, self.prefop_type, self.admin_ip, len(names), names)
        return GameData(self.id, self.prefop_type, self.admin_ip, len(names), names, self.range_ip._range.tolist(), self.range_oop._range.tolist())

    def get_players(self) -> List[dict]:
        return [asdict(PlayerData(p.id, p.name, p.stack, p.preflop_range._range.tolist())) for p in self.table.players]

    def get_preflop_ranges(self) -> List:
        if self.table.button == 0 and len(self.table.players) == 0:
            # IP
            return []
        else:
            # OOP
            return []
    def private_data(self, name: str) -> dict:
        return self.table.private_data(name)

    def add_player(self, id: str, name: str, stack: float|None, rng: List[List[float]]):
        if stack == None:
            stack = self.table.depth
        p = Player(id, name, stack, Range(np.array(rng)), self.table, 0)
        self.table.add_player(p)


    def disconnect(self, player_id: str) -> str | None:
        name = None
        for p in self.table.players:
            if p.id == player_id:
                name = p.name
        if name == None:
            return None
        self.table.remove_player(name)
        return name
    
    def start_game(self):
        self.table.start_game()

    def get_table_data(self) -> dict:
        return self.table.data()

    def new_round(self):
        self.table.new_round()

    def action(self, hero_name: str, amount: float, action: str) -> None:
        d = {'bet': Action.BET,
             'check': Action.CHECK,
             'call': Action.CALL,
             'raise': Action.RAISE,
             'fold': Action.FOLD}

        print(hero_name, action, amount)
        self.table.act(d[action], hero_name, amount)



class GameManager:
    def __init__(self):
        self.games: Dict[str, Game] = {}
        self.ranges_set: Dict[str, bool] = {}

    def create_game(self,
                     starting_pot: float,
                     depth: float,
                     in_position: bool,
                     preflop_type_s: str,
                     move_button: bool=False,
                     sb: float=0.5,
                     bb: float=1) -> Table:

        assert preflop_type_s == 'default' or preflop_type_s in ranges, f'{preflop_type_s} not in {list(ranges.keys())}'

        game_id = self.generate_id()
        depth = round(depth - starting_pot / 2, 2)
        table = Table(id=game_id, starting_pot=starting_pot, depth=depth, move_button=move_button, sb=sb, bb=bb)
        if not in_position:
            # we will join first and be on button, so we move button to be oop
            table.button = 1
        range_oop, range_ip = None, None
        if preflop_type_s != 'default':
            range_oop, range_ip = ranges[preflop_type_s]
        
        self.games[game_id] = Game(game_id, preflop_type_s, in_position, table, range_oop, range_ip)
        return table

    def exists(self, table_game_id: str):
        return table_game_id in self.games

    def generate_id(self) -> str:
        id = str(uuid.uuid4())[:8]
        if self.exists(id):
            return self.generate_id()
        return id

    def get_games(self) -> List[dict]:
        all_games = self.games.values()
        return [asdict(g.data()) for g in all_games]

    def get_players(self, game_id: str) -> List[dict]:
        assert self.exists(game_id)
        return self.games[game_id].get_players()
    
    def get_private(self, game_id: str, player_name: str) -> dict | None:
        if not self.exists(game_id):
            return None
        game = self.games[game_id]
        return game.private_data(player_name)

    def add_player(self, 
                   game_id: str, 
                   player_id: str, 
                   name: str,  
                   preflop_range: List[List[float]], 
                   stack: float|None=None):
        assert self.exists(game_id)
        self.games[game_id].add_player(player_id, name, stack, preflop_range)

    def disconnect(self, player_id: str, game_id: str) -> str | None:
        game: Game = self.games[game_id]
        name = game.disconnect(player_id)
        if len(game.get_players()) == 0:
            self.games.pop(game_id)
        return name

    def start_game(self, game_id: str):
        assert self.exists(game_id)
        self.games[game_id].start_game()

    def get_table_data(self, game_id: str) -> dict:
        assert self.exists(game_id)
        return self.games[game_id].get_table_data()

    def start_round(self, game_id: str):
        assert self.exists(game_id)
        self.games[game_id].new_round()

    def action(self, game_id: str, hero_name: str, amount: float, action: str):
        assert self.exists(game_id)
        self.games[game_id].action(hero_name, amount, action)

    def get_rooms(self, player_id: str):
        res = []
        for game_id, game in self.games.items():
            if player_id in list(map(lambda p: p.id, game.table.players)):
                res.append(game_id)
        return res

    def get_game_data(self, game_id: str) -> dict:
        return asdict(self.games[game_id].data())
