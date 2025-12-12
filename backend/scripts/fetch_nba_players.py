from nba_api.stats.endpoints import commonallplayers, playergamelog, commonteamroster
from nba_api.stats.static import teams
from sqlalchemy.orm import joinedload
from concurrent.futures import ThreadPoolExecutor, as_completed
import time
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models import Player, PlayerGameStats, SessionLocal, create_tables

MAX_WORKERS = 5
BATCH_SIZE = 20  # liczba graczy na batch

def fetch_latest_game_log(player_id: int):
    try:
        df = playergamelog.PlayerGameLog(player_id=player_id, season="2025-26", timeout=30).get_data_frames()[0]
        if not df.empty:
            return player_id, df.iloc[0]
        return player_id, None
    except Exception as e:
        print(f"Failed to fetch player {player_id}: {e}")
        return player_id, None

def sync_all_players_from_api():
    """
    Fetches all players and their positions from the API, then creates new players
    or updates existing ones in the database.
    """
    print("Syncing all players from NBA API...")
    db = SessionLocal()
    try:
        all_players_df = commonallplayers.CommonAllPlayers(is_only_current_season=1).get_data_frames()[0]

        team_list = teams.get_teams()
        roster_data = {}
        print("Fetching team rosters to get player positions...")
        for t in team_list:
            try:
                roster = commonteamroster.CommonTeamRoster(team_id=t["id"]).get_data_frames()[0]
                for _, row in roster.iterrows():
                    roster_data[row["PLAYER_ID"]] = row.get("POSITION")
                time.sleep(1.0)
            except Exception as e:
                print(f"Could not fetch roster for team {t['full_name']}: {e}")

        print("Updating database with player info...")
        added_count = 0
        updated_count = 0
        db_players = {p.id: p for p in db.query(Player).all()}

        for _, p_row in all_players_df.iterrows():
            player_id = p_row["PERSON_ID"]
            position = roster_data.get(player_id, "N/A")

            if player_id in db_players:
                player = db_players[player_id]
                player.full_name = p_row["DISPLAY_FIRST_LAST"]
                player.is_active = p_row["ROSTERSTATUS"] == 1
                player.team_name = p_row["TEAM_ABBREVIATION"]
                player.position = position
                updated_count += 1
            else:
                new_player = Player(
                    id=player_id,
                    full_name=p_row["DISPLAY_FIRST_LAST"],
                    is_active=p_row["ROSTERSTATUS"] == 1,
                    team_name=p_row["TEAM_ABBREVIATION"],
                    position=position,
                )
                db.add(new_player)
                added_count += 1
        
        db.commit()
        print(f"Sync completed. Added: {added_count}, Updated: {updated_count}")

    except Exception as e:
        print(f"An error occurred during player sync: {e}")
        db.rollback()
    finally:
        db.close()

def update_stats_for_active_players():
    print("Updating stats using BATCH method...")
    db = SessionLocal()
    try:
        active_players = db.query(Player).options(joinedload(Player.game_stats)).filter(Player.is_active == True).all()
        if not active_players:
            print("No active players found.")
            return

        player_map = {p.id: p for p in active_players}
        player_ids = list(player_map.keys())
        total_players = len(player_ids)
        print(f"Active players: {total_players}")

        updated_count = 0

        # Dzielimy na batch-e
        for i in range(0, total_players, BATCH_SIZE):
            batch_ids = player_ids[i:i + BATCH_SIZE]
            print(f"Fetching batch {i//BATCH_SIZE + 1} ({len(batch_ids)} players)...")

            with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
                futures = [executor.submit(fetch_latest_game_log, pid) for pid in batch_ids]
                for future in as_completed(futures):
                    player_id, latest_game = future.result()
                    if latest_game is None:
                        continue

                    player = player_map[player_id]
                    game_id = latest_game["Game_ID"]
                    existing_game = next((g for g in player.game_stats if g.game_id == game_id), None)
                    if existing_game:
                        continue

                    points = int(latest_game["PTS"])
                    rebounds = int(latest_game["REB"])
                    assists = int(latest_game["AST"])
                    fp = points + 1.2 * rebounds + 1.5 * assists

                    new_game = PlayerGameStats(
                        player_id=player.id,
                        game_id=game_id,
                        game_date=latest_game["GAME_DATE"],
                        points=points,
                        rebounds=rebounds,
                        assists=assists,
                        fantasy_points=fp
                    )
                    db.add(new_game)
                    player.game_stats.append(new_game)

                    # aktualizacja średnich FP
                    total_fp = sum(stat.fantasy_points for stat in player.game_stats)
                    player.average_fantasy_points = total_fp / len(player.game_stats)

                    updated_count += 1
                    print(f"Updated {player.full_name} ({game_id}), avg FP: {player.average_fantasy_points:.2f}")

            # Pauza między batchami, żeby nie przeciążać API
            time.sleep(20)

        db.commit()
        print(f"\nUpdated stats for {updated_count} games.")

    except Exception as e:
        print(f"Error during stats update: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing database...")
    create_tables()
    print("Database initialized.")

    args = sys.argv[1:]
    if not args:
        print("\n--- Running Full Sync (Players and Stats) ---")
        sync_all_players_from_api()
        update_stats_for_active_players()
    elif "sync" in args:
        print("\n--- Running Player Sync Only ---")
        sync_all_players_from_api()
    elif "stats" in args:
        print("\n--- Running Stats Update Only ---")
        update_stats_for_active_players()
    else:
        print(f"Invalid argument: {args[0]}")
        print("Usage: python fetch_nba_players.py [sync|stats]")

    print("\nScript finished.")