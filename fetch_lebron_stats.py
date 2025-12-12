import sys
import os
from nba_api.stats.endpoints import playergamelog
from sqlalchemy.orm import joinedload

# Add the backend directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

from backend.models import Player, PlayerGameStats, SessionLocal

def fetch_and_store_lebron_stats():
    """
    Fetches the latest game stats for LeBron James, adds them to the historical
    game stats table if new, and recalculates his average fantasy points.
    """
    db = SessionLocal()
    lebron_id = 2544  # Correct Player ID for LeBron James

    try:
        # Find LeBron James in the database and eager load his game stats
        lebron = db.query(Player).options(joinedload(Player.game_stats)).filter(Player.id == lebron_id).first()

        if not lebron:
            print(f"Player with ID {lebron_id} (LeBron James) not found in the database.")
            # Optional: Create the player if he doesn't exist
            # lebron = Player(id=lebron_id, full_name="LeBron James", is_active=True)
            # db.add(lebron)
            # db.commit()
            # db.refresh(lebron)
            # print("Created LeBron James in the database.")
            return

        print(f"Fetching latest stats for {lebron.full_name}...")

        # Fetch the game log for the 2025-26 season
        log_df = playergamelog.PlayerGameLog(player_id=lebron_id, season="2025-26").get_data_frames()[0]

        if not log_df.empty:
            latest_game = log_df.iloc[0]
            game_id = latest_game["Game_ID"]

            # Check if this game's stats are already in the database
            existing_game = next((g for g in lebron.game_stats if g.game_id == game_id), None)
            
            if existing_game:
                print(f"Stats for game {game_id} already exist. No update needed.")
                print(f"Current Average Fantasy Points: {lebron.average_fantasy_points:.2f}")
                return

            # --- It's a new game, process it ---
            print(f"New game found (ID: {game_id}). Adding to history...")
            points = int(latest_game["PTS"])
            rebounds = int(latest_game["REB"])
            assists = int(latest_game["AST"])
            fantasy_points = float(points + 1.2 * rebounds + 1.5 * assists)

            # Create a new record for the individual game
            new_game_stat = PlayerGameStats(
                player_id=lebron.id,
                game_id=game_id,
                game_date=latest_game["GAME_DATE"],
                points=points,
                rebounds=rebounds,
                assists=assists,
                fantasy_points=fantasy_points
            )
            db.add(new_game_stat)
            lebron.game_stats.append(new_game_stat) # Append for immediate calculation

            # Recalculate the average
            total_fp = sum(stat.fantasy_points for stat in lebron.game_stats)
            game_count = len(lebron.game_stats)
            lebron.average_fantasy_points = total_fp / game_count if game_count > 0 else 0.0
            
            db.commit()

            print("\nSuccessfully updated stats:")
            print(f"  - Added stats for game on {new_game_stat.game_date}")
            print(f"  - New Average Fantasy Points: {lebron.average_fantasy_points:.2f} ({game_count} games total)")
        else:
            print("No new game logs found for the season.")

    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fetch_and_store_lebron_stats()
