# NBA Fantasy App

This is a fantasy basketball application built with a React frontend and a FastAPI backend.

## How to Deploy to Render

1.  **Push your code to a GitHub repository.**
    *   Create a new repository on GitHub.
    *   Push your project to the new repository.

2.  **Create a new "Blueprint" service on Render.**
    *   Go to the [Render Dashboard](https://dashboard.render.com/).
    *   Click on **New** and then **Blueprint**.
    *   Connect your GitHub account and select the repository you just created.
    *   Render will automatically detect the `render.yaml` file and propose a deployment plan.

3.  **Review and confirm the deployment plan.**
    *   Render will show you the services to be created (backend, frontend, and database).
    *   Click **Apply** to start the deployment.

4.  **Wait for the deployment to complete.**
    *   You can monitor the progress in the Render dashboard.

5.  **Update the environment variables.**
    *   After the first deployment is complete, you need to set the URLs for your services.
    *   **Backend Service (`nba-fantasy-backend`):**
        *   Go to the **Environment** tab.
        *   Add a new environment variable:
            *   **Key:** `FRONTEND_URL`
            *   **Value:** The URL of your deployed frontend (e.g., `https://nba-fantasy-frontend.onrender.com`).
    *   **Frontend Service (`nba-fantasy-frontend`):**
        *   Go to the **Environment** tab.
        *   Add a new environment variable:
            *   **Key:** `REACT_APP_API_URL`
            *   **Value:** The URL of your deployed backend (e.g., `https://nba-fantasy-backend.onrender.com`).

6.  **Trigger a new deployment.**
    *   After updating the environment variables, trigger a new deployment for the changes to take effect. You can do this by going to the service's dashboard and clicking **Manual Deploy** > **Deploy latest commit**.

Your application should now be live on Render!

## How to Populate the Database with Players (Free Plan)

After deploying your application, the database will be empty. You need to run a script to fill it with players. The easiest way to do this on the free plan is by using SSH.

1.  **Go to your Render Dashboard.**
2.  Navigate to your backend service (`nba-fantasy-backend`).
3.  Find the **SSH** connection info on the dashboard page for your service. Click the **"Connect"** button or copy the provided SSH command.
4.  Paste the command into your local terminal and press Enter. If prompted, type `yes` to continue.
5.  You are now connected to your running application's container. Run the player sync script with this command:
    ```bash
    python scripts/fetch_nba_players.py sync
    ```
6.  The script will print its progress in your terminal. Wait for it to complete.
7.  Once finished, you can disconnect by typing `exit`.

Your database is now populated with NBA players, and they should appear in your application.
