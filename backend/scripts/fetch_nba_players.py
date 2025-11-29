import sys
import os
from nba_api.stats.static import players 

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import SessionLocal, Player, create_tables

def fetch_and_store_nba_players():

    print("Fetching NBA players data...")

    try:
        nba_players = players.get_players()
    except Exception as e:
        print(f"Error fetching NBA players data: {e}")
        return
    
    db = SessionLocal()

    print("Storing NBA players data into the database...",flush=True)

    added_count = 0
    for player_data in nba_players:
        player_id = player_data['id']
        full_name = player_data['full_name']

        existing_player = db.query(Player).filter(Player.id == player_id).first()

        if not existing_player:
            new_player = Player(id=player_id, full_name=full_name, position=None, team_name=None)
            db.add(new_player)
            added_count += 1

        else:

        #logika aktualizacji
            #existing_player.full_name = full_name
            #db.add(existing_player)
            pass
    db.commit()
    db.close()

if __name__ == "__main__":
    create_tables()
    fetch_and_store_nba_players()
    
