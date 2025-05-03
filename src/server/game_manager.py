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
        self.depth = preflop_type.depth
        
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
base = PreflopType('SRP', 'BUTvsBB', 'HU', 2.5 * 2, 100-2.5)
ranges[str(base)] = (
        Range(np.array(oop)),
        Range(np.array(ip)),
)

@dataclass
class TableData:
    id: str
    players: int


@dataclass
class PlayerData:
    name: str
    stack: float


class GameManager:
    def __init__(self):
        self.tables: Dict[str, Table] = {}
        self.ranges_set: Dict[str, bool] = {}

    def create_table(self, starting_pot: float, depth: float, preflop_spot: PreflopSpot, sb: float=0.5, bb: float=1) -> Table:
        table_id = self.generate_id()
        depth = round(depth - starting_pot / 2, 2)
        self.tables[table_id] = Table(table_id, starting_pot, depth, sb, bb)

        return self.tables[table_id]

    def exists(self, table_id: str):
        return table_id in self.tables

    def generate_id(self) -> str:
        # Generate unique ID for the table
        table_id = str(uuid.uuid4())[:8]
        if self.exists(table_id):
            return self.generate_id()
        return table_id

    def get_tables(self) -> List[dict]:
        all_tables = self.tables.values()
        return [asdict(TableData(t.id, len(t.players))) for t in all_tables]

    def get_players(self, table_id: str) -> List[str]:
        return [p.name for p in self.tables[table_id].players]

    def get_private(self, table_id: str, player_name: str) -> dict | None:
        if not self.exists(table_id):
            return None
        return self.tables[table_id].private_data(player_name)

    def get_table(self, table_id: str):
        return self.tables[table_id]

    def add_player(self, table_id: str, id: str, name: str,  preflop_range: List[List[float]], stack: float=None):
        assert self.exists(table_id)
        r = Range(np.array(preflop_range))
        print(f'Range: {r}')
        self.tables[table_id].add_player(id, name, r, stack)

    def get_player_states(self, table_id: str) -> List[dict]:
        assert self.exists(table_id)
        table = self.tables[table_id]
        return [asdict(PlayerData(p.name, p.stack)) for p in table.players]

    def get_player_table(self, player_id: str) -> Tuple[str, Player] | Tuple[None, None]:
        for table_id, table in self.tables.items():
            for player in table.players:
                if player.id == player_id:
                    return table_id, player
        return None, None

    def disconnect(self, player_id: str) -> Tuple[str, Player] | Tuple[None, None]:
        table_id, player = self.get_player_table(player_id)
        if table_id is None or player is None:
            return None, None
        table = self.tables[table_id]

        hero_name = player.name
        table.remove_player(hero_name)

        if len(table.players) == 0:
            self.tables.pop(table_id, None)
            assert not self.exists(table_id)
            print(f"Table {table_id} removed (no players left)")
        return table_id, player

    def start_table(self, table_id: str):
        self.tables[table_id].start_game()

    def get_table_data(self, table_id: str):
        return self.tables[table_id].data()

    def start_round(self, table_id: str):
        table = self.tables[table_id]
        n = len(table.players)

        min_players = 2
        max_players = 2

        assert n >= min_players, 'not enough players to start the round'
        assert n <= max_players, 'to many players'

        table.new_round()

    def action(self, table_id: str, hero_name: str, amount: float, action: str):
        assert self.exists(table_id)
        table = self.tables[table_id]
        d = {'bet': Action.BET,
             'check': Action.CHECK,
             'call': Action.CALL,
             'raise': Action.RAISE,
             'fold': Action.FOLD}

        print(hero_name, action, amount)
        table.act(d[action], hero_name, amount)
