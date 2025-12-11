from nba_api.stats.endpoints import commonallplayers, playergamelog
import time
import os
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models import Player, SessionLocal, create_tables

MAX_WORKERS = 2  # Number of parallel threads

def fetch_player_stats_with_retry(player_id: int, max_retries: int = 3, delay: float = 2):
    """Fetches game log for a player with a retry mechanism."""
    for attempt in range(max_retries):
        try:
            log_df = playergamelog.PlayerGameLog(player_id=player_id, season="2025-26", timeout=60).get_data_frames()[0]
            if not log_df.empty:
                latest = log_df.iloc[0]
                points = int(latest["PTS"])
                rebounds = int(latest["REB"])
                assists = int(latest["AST"])
                fantasy_points = float(points + 1.2 * rebounds + 1.5 * assists)
                return player_id, points, rebounds, assists, fantasy_points
            else:
                # No log found, return zero stats
                return player_id, 0, 0, 0, 0.0
        except Exception as e:
            print(f"Attempt {attempt + 1} failed for player {player_id}: {e}")
            if attempt < max_retries - 1:
                time.sleep(delay * (2 ** attempt)) # Exponential backoff
            else:
                print(f"All retries failed for player {player_id}.")
    return player_id, 0, 0, 0, 0.0

def sync_all_players_from_api():
    """
    Fetches all players from the API and ensures they exist in the database.
    This function only syncs basic info, not stats.
    """
    print("Syncing all players from NBA API...")
    db = SessionLocal()
    try:
        all_players_df = commonallplayers.CommonAllPlayers(is_only_current_season=1).get_data_frames()[0]
        existing_player_ids = {p.id for p in db.query(Player.id).all()}
        
        new_players = []
        for _, row in all_players_df.iterrows():
            player_id = row["PERSON_ID"]
            if player_id not in existing_player_ids:
                new_players.append(Player(
                    id=player_id,
                    full_name=row["DISPLAY_FIRST_LAST"],
                    is_active=row["ROSTERSTATUS"] == 1,
                    team_name=row["TEAM_ABBREVIATION"]
                ))
        
        if new_players:
            db.bulk_save_objects(new_players)
            db.commit()
            print(f"Added {len(new_players)} new players.")
        else:
            print("No new players to add.")

    except Exception as e:
        print(f"Error syncing players from API: {e}")
        db.rollback()
    finally:
        db.close()

def update_stats_for_active_players():
    """
    Fetches and updates stats for all active players in the database using parallel processing.
    """
    print("Updating stats for active players...")
    db = SessionLocal()
    try:
        active_players = db.query(Player).filter(Player.is_active == True).all()
        player_map = {p.id: p for p in active_players}
        
        if not active_players:
            print("No active players found to update.")
            return

        print(f"Found {len(active_players)} active players. Fetching stats in parallel...")
        
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            # Submit all players to the executor
            future_to_player = {executor.submit(fetch_player_stats_with_retry, p.id): p.id for p in active_players}
            
            updated_count = 0
            for future in as_completed(future_to_player):
                player_id, points, rebounds, assists, fantasy_points = future.result()
                
                player = player_map.get(player_id)
                if player:
                    player.points = points
                    player.rebounds = rebounds
                    player.assists = assists
                    player.fantasy_points = fantasy_points
                    updated_count += 1
                    print(f"Updated stats for: {player.full_name}")

        db.commit()
        print(f"\nSuccessfully updated stats for {updated_count} players.")

    except Exception as e:
        print(f"An error occurred during stat update: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Step 1: Ensure all players from the API are in our DB
    sync_all_players_from_api()
    
    # Step 2: Update stats for all active players
    update_stats_for_active_players()
    
    print("\nScript finished.")
