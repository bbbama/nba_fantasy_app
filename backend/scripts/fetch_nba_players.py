from nba_api.stats.endpoints import commonallplayers, commonteamroster
from nba_api.stats.static import teams
import time
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models import Player, SessionLocal, create_tables

def fetch_and_store_nba_players():
    print("Fetching NBA players...")

    try:
        all_players = commonallplayers.CommonAllPlayers(is_only_current_season=1).get_data_frames()[0]
    except Exception as e:
        print(f"Error fetching players: {e}")
        return

    db = SessionLocal()

    team_list = teams.get_teams()
    roster_data = {}

    print("Fetching team rosters with positions...")

    # ------ POBRANIE WSZYSTKICH POZYCJI 30 ZAPYTAŃ ------
    for t in team_list:
        try:
            team_id = t["id"]
            roster = commonteamroster.CommonTeamRoster(team_id).get_data_frames()[0]

            for _, row in roster.iterrows():
                roster_data[row["PLAYER_ID"]] = {
                    "position": row.get("POSITION", "N/A"),
                    "team": t["abbreviation"],
                }

            time.sleep(0.4)  # delikatny cooldown, aby nie dostać rate-limit

        except Exception as e:
            print(f"Could not fetch roster for team {t['full_name']}: {e}")
    # -----------------------------------------------------

    print("Storing players...")

    added_count = 0
    updated_count = 0

    for _, p in all_players.iterrows():
        player_id = p["PERSON_ID"]
        full_name = p["DISPLAY_FIRST_LAST"]
        is_active = p["ROSTERSTATUS"] == 1
        team_abbr = p["TEAM_ABBREVIATION"]

        # Pozyskana z roster_data
        position = roster_data.get(player_id, {}).get("position", "N/A")

        existing = db.query(Player).filter(Player.id == player_id).first()

        if not existing:
            new_player = Player(
                id=player_id,
                full_name=full_name,
                is_active=is_active,
                position=position,
                team_name=team_abbr,
            )
            db.add(new_player)
            added_count += 1
        else:
            existing.full_name = full_name
            existing.is_active = is_active
            existing.position = position
            existing.team_name = team_abbr
            updated_count += 1


    db.commit()
    db.close()
    print(f"Completed. Added: {added_count}, Updated: {updated_count}")

if __name__ == "__main__":
    create_tables()
    fetch_and_store_nba_players()
