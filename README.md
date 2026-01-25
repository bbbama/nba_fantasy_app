# NBA Fantasy App

This is a full-stack NBA Fantasy League application, designed to allow users to build and manage their fantasy basketball teams, compete in leagues, and track player performance.

## Features

### User Management
*   **User Registration & Login:** Secure user authentication.
*   **Profile Management:** Users can update their nickname and change their password.
*   **Admin Panel:** Administrative users can manage all registered users (delete, reset password) and trigger player data synchronization.

### Team & Player Management
*   **Player Browsing:** View a list of all available NBA players with their positions, teams, and average fantasy points.
*   **Search & Filter:** Easily find players by name.
*   **My Team:** Users can add and remove players from their fantasy team, with validation for position limits (e.g., max 4 Guards, 4 Forwards, 2 Centers, max 10 total players).
*   **Fantasy Points:** Player statistics include last game fantasy points and average fantasy points.

### Leagues (New Feature!)
*   **Create Leagues:** Users can create their own private leagues.
*   **Join Leagues:** Users can join existing leagues using a unique invite code.
*   **View Leagues:** See a list of all leagues you are a member of. Admins can view all leagues in the system.
*   **League Details:** View members of a specific league, including their nicknames/emails and total fantasy points.
*   **Delete Leagues:** League owners or admins can delete leagues.

### Design & User Experience
*   **Elegant NBA-Styled Dark Theme:** A consistent and visually appealing dark theme across the application using Material-UI and Tailwind CSS.
*   **Global Notifications:** Non-intrusive success/error messages via Material-UI Snackbar.
*   **Responsive Design:** Optimized for various screen sizes (mobile, tablet, desktop).

## Local Development Setup

Follow these steps to set up and run the NBA Fantasy App locally.

### Prerequisites

*   **Python 3.8+:** For the FastAPI backend.
*   **Node.js (LTS recommended) & npm (or Yarn):** For the React frontend.

### 1. Backend Setup

The backend is built with FastAPI and uses SQLAlchemy for database interaction (SQLite by default).

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a Python virtual environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On macOS/Linux
    # venv\Scripts\activate   # On Windows (Command Prompt)
    # venv\Scripts\Activate.ps1 # On Windows (PowerShell)
    ```

3.  **Install backend dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Initialize the database:**
    *   **Important:** If you've made significant schema changes (like adding new tables or columns), you should delete the old database file to ensure a clean setup.
    *   Delete existing database file (if any, this will erase all data):
        ```bash
        rm data/nba_fantasy.db
        ```
    *   Create database tables:
        ```bash
        python3 models.py
        ```
    *   *Note: For production environments, consider using a proper migration tool like Alembic.*

5.  **Run the backend server:**
    ```bash
    uvicorn main:app --reload
    ```
    The backend API will be available at `http://localhost:8000`.

### 2. Frontend Setup

The frontend is a React application built with TypeScript, Material-UI, and Tailwind CSS.

1.  **Open a new terminal window** and navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  **Install frontend dependencies:**
    ```bash
    npm install
    # or yarn install
    ```

3.  **Run the frontend development server:**
    ```bash
    npm start
    # or yarn start
    ```
    The frontend application will open in your browser at `http://localhost:3000`.

### 3. Using the Application

*   **Access:** Open your browser to `http://localhost:3000`.
*   **Register First User (Admin):** The very first user to register will automatically be assigned the `admin` role. Use this account to access the Admin Panel.
*   **Explore Features:** Log in, build your team, create/join leagues, and check the leaderboard.