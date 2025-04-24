from dataclasses import dataclass, asdict
from typing import List, Tuple, Dict
import uuid
import numpy as np

from pokergame import Table, Action, Player, Range


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

    def create_table(self, sb: float, bb: float) -> Table:
        table_id = self.generate_id()
        self.tables[table_id] = Table(table_id, sb, bb)

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

    def add_player(self, table_id: str, id: str, name: str, stack: float, preflop_range: List[List[float]]):
        assert self.exists(table_id)
        r = Range(np.array(preflop_range))
        print(f'Range: {r}')
        self.tables[table_id].add_player(id, name, stack, r)

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

    def start_table(self, table_id: str, starting_pot: float):
        self.tables[table_id].start_game(starting_pot)

    def get_table_data(self, table_id):
        return self.tables[table_id].data()

    def start_round(self, table_id):
        table = self.tables[table_id]
        n = len(table.players)

        min_players = 2
        max_players = 2

        assert n >= min_players, 'not enough players to start the round'
        assert n <= max_players, 'to many players'

        table.new_round()

    def action(self, table_id, hero_name, amount, action):
        assert self.exists(table_id)
        table = self.tables[table_id]
        d = {'bet': Action.BET,
             'check': Action.CHECK,
             'call': Action.CALL,
             'raise': Action.RAISE,
             'fold': Action.FOLD}

        print(hero_name, action, amount)
        table.act(d[action], hero_name, amount)
