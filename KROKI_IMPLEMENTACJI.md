# Kroki Implementacji Aplikacji NBA Fantasy

Ten plik opisuje kolejne etapy tworzenia aplikacji, od konfiguracji po wdrożenie poszczególnych funkcjonalności.

### Faza 0: Konfiguracja Projektu

1.  **Utworzenie Struktury Katalogów:**
    *   Stworzenie głównych folderów: `backend/` dla aplikacji serwerowej i `frontend/` dla aplikacji klienckiej.
2.  **Inicjalizacja Backendu:**
    *   Utworzenie wirtualnego środowiska Python w katalogu `backend`.
    *   Instalacja niezbędnych bibliotek: `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`, `python-jose`, `passlib`, `python-multipart`.
3.  **Inicjalizacja Frontendu:**
    *   Stworzenie aplikacji React z szablonem TypeScript w katalogu `frontend` za pomocą `npx create-react-app frontend --template typescript`.
    *   Instalacja dodatkowych bibliotek: `axios` (do zapytań HTTP), `react-router-dom` (do routingu), `@mui/material` (do komponentów UI).

### Faza 1: Implementacja Backendu (FastAPI)

1.  **Modele Bazy Danych (SQLAlchemy):**
    *   Zdefiniowanie modeli dla: `User` (użytkownik), `Player` (zawodnik NBA), `UserTeam` (powiązanie użytkownika z zawodnikami).
2.  **Konfiguracja Bazy Danych:**
    *   Utworzenie mechanizmu połączenia z bazą SQLite.
    *   Stworzenie skryptu inicjalizującego, który tworzy tabele w bazie danych.
3.  **Schematy Pydantic:**
    *   Zdefiniowanie schematów danych dla operacji API (np. `UserCreate`, `UserLogin`, `PlayerResponse`, `Token`).
4.  **Uwierzytelnianie i Autoryzacja (JWT):**
    *   Implementacja endpointów `/register` i `/login`.
    *   Stworzenie mechanizmu generowania i weryfikacji tokenów JWT.
    *   Zdefiniowanie zależności (dependencies) dla zabezpieczonych endpointów, wymagających zalogowania (i opcjonalnie roli admina).
5.  **Endpointy API (REST):**
    *   **Użytkownicy:** Endpointy do zarządzania profilem użytkownika.
    *   **Zawodnicy:** Endpoint `GET /players` do pobierania listy wszystkich dostępnych zawodników.
    *   **Drużyna Użytkownika:** Endpointy `GET /me/team` i `POST /me/team` do zarządzania składem zalogowanego użytkownika.
6.  **Panel Administratora:**
    *   Stworzenie zabezpieczonych endpointów (wymagających roli admina) do zarządzania bazą zawodników (CRUD - Create, Read, Update, Delete).
7.  **Pobieranie Danych Zewnętrznych:**
    *   Implementacja skryptu lub endpointu, który łączy się z zewnętrznym API NBA, pobiera statystyki (punkty, zbiórki, asysty) i zapisuje je w bazie danych.

### Faza 2: Implementacja Frontendu (React)

1.  **Konfiguracja Projektu i Stylizacji:**
    *   Podstawowa konfiguracja motywu Material-UI (MUI).
    *   Stworzenie globalnych stylów.
2.  **Routing:**
    *   Skonfigurowanie `react-router-dom` do obsługi publicznych ścieżek (`/login`, `/register`) i prywatnych (`/dashboard`, `/team-selection`).
    *   Stworzenie komponentu `PrivateRoute`, który będzie chronił ścieżki wymagające zalogowania.
3.  **Zarządzanie Stanem i Autentykacją:**
    *   Stworzenie kontekstu (React Context) do globalnego zarządzania stanem uwierzytelnienia użytkownika.
    *   Implementacja logiki zapisu i usuwania tokenu JWT z `localStorage`.
4.  **Komponenty UI:**
    *   **Strony:** `LoginPage`, `RegisterPage`, `DashboardPage`, `TeamPage`.
    *   **Komponenty reużywalne:** `Navbar`, `PlayerCard`, `TeamList`, `LoadingSpinner`.
5.  **Integracja z API:**
    *   Stworzenie serwisu `api.ts` (z użyciem `axios`) do komunikacji z backendem.
    *   Podłączenie komponentów do endpointów API w celu pobierania i wysyłania danych.
    *   Obsługa błędów i stanu ładowania.

### Faza 3: Integracja i Finalizacja

1.  **Konfiguracja CORS (Cross-Origin Resource Sharing):**
    *   Umożliwienie backendowi przyjmowania zapytań z adresu, na którym działa aplikacja frontendowa.
2.  **Testowanie:**
    *   Sprawdzenie poprawności działania wszystkich kluczowych funkcjonalności (rejestracja, logowanie, wybór drużyny, naliczanie punktów).
3.  **Walidacja HTML:**
    *   Upewnienie się, że kod generowany przez aplikację jest zgodny ze standardem HTML5 (np. przy użyciu walidatora W3C).
4.  **Dokumentacja:**
    *   Uzupełnienie pliku `README.md` o instrukcje dotyczące uruchomienia projektu (backendu i frontendu).
