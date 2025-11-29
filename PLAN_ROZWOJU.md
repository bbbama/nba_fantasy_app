# Plan Rozwoju Aplikacji NBA Fantasy

Ten dokument opisuje kolejne kroki implementacyjne, które należy podjąć, aby rozwinąć aplikację o nowe funkcjonalności.

### Faza 1: Backend - Integracja z Zewnętrznym API

**Cel:** Zasilenie bazy danych prawdziwymi danymi o zawodnikach i ich statystykach.

1.  **Wybór Zewnętrznego API:**
    *   Znalezienie darmowego lub freemium API dostarczającego dane o zawodnikach NBA (np. `balldontlie.io`, `the-sports-api.com` lub inne).
2.  **Stworzenie Skryptu do Pobierania Danych:**
    *   Utworzenie nowego pliku w backendzie, np. `scripts/fetch_data.py`.
    *   W skrypcie:
        *   Nawiązanie połączenia z wybranym API.
        *   Pobranie listy zawodników.
        *   Transformacja danych do formatu zgodnego z Twoim modelem `Player` w bazie danych.
        *   Zapisanie lub aktualizacja zawodników w bazie danych.
3.  **Uruchomienie Skryptu:**
    *   Skrypt będzie można uruchamiać ręcznie w celu zaktualizowania bazy danych. W przyszłości można pomyśleć o automatyzacji tego procesu.

### Faza 2: Frontend - Zarządzanie Drużyną

**Cel:** Umożliwienie użytkownikom tworzenia i zarządzania własną drużyną fantasy.

1.  **Stworzenie Komponentu `PlayerCard`:**
    *   **Plik:** `src/components/PlayerCard.tsx`
    *   **Opis:** Komponent będzie wyświetlał informacje o jednym zawodniku w estetyczny sposób (zdjęcie, imię, pozycja, drużyna). Będzie zawierał przycisk "Dodaj do drużyny".
2.  **Modyfikacja `PlayersPage`:**
    *   **Plik:** `src/pages/PlayersPage.tsx`
    *   **Opis:** Zamiast prostej listy, strona będzie wyświetlać siatkę komponentów `PlayerCard`. Po kliknięciu "Dodaj do drużyny", zawodnik zostanie dodany do tymczasowej listy (stanu komponentu).
3.  **Stworzenie Strony Drużyny (`TeamPage`):**
    *   **Plik:** `src/pages/TeamPage.tsx`
    *   **Opis:** Nowa strona, na której użytkownik zobaczy zawodników wybranych do jego drużyny. Będzie pobierać dane z endpointu `GET /me/team`. Umożliwi również zapisanie finalnej wersji drużyny za pomocą endpointu `POST /me/team`.
4.  **Aktualizacja Nawigacji i Routingu:**
    *   Dodanie w `App.tsx` linku do nowej strony `/team` oraz zabezpieczenie jej za pomocą `PrivateRoute`.

### Faza 3: Testowanie i Dokumentacja

**Cel:** Zapewnienie jakości i przygotowanie projektu do udostępnienia.

1.  **Testy Automatyczne:**
    *   **Backend:** Napisanie testów jednostkowych i integracyjnych dla kluczowych endpointów (rejestracja, logowanie, zarządzanie drużyną) przy użyciu `pytest`.
    *   **Frontend:** Stworzenie testów dla komponentów `LoginPage`, `RegisterPage` i `PlayersPage` przy użyciu `React Testing Library`.
2.  **Dokumentacja:**
    *   **Plik:** `README.md`
    *   **Opis:** Uzupełnienie dokumentacji o szczegółowe instrukcje:
        *   Jak skonfigurować i uruchomić backend.
        *   Jak skonfigurować i uruchomić frontend.
        *   Jak uruchomić skrypt do pobierania danych.
        *   Opis dostępnych endpointów API.

Po zrealizowaniu tych kroków aplikacja będzie w pełni funkcjonalnym prototypem.


 Backend:

   1. Implementacja logiki formowania składu: Stworzenie endpointów API do tworzenia, edytowania i pobierania składów drużyn użytkowników.
   2. Obliczanie punktów fantasy: Rozwinięcie logiki do obliczania punktów dla każdego gracza na podstawie jego rzeczywistych statystyk z
      meczów NBA.
   3. Rankingi i ligi: Stworzenie systemu lig, do których mogą dołączać użytkownicy, oraz generowanie rankingów na podstawie zdobytych
      punktów.
   4. Automatyzacja pobierania danych: Udoskonalenie skryptów do regularnego i automatycznego pobierania aktualnych statystyk graczy i
      wyników meczów.

  Frontend:

   1. Zarządzanie składem: Stworzenie interfejsu użytkownika, który pozwoli na łatwe dodawanie i usuwanie graczy z drużyny fantasy.
   2. Wizualizacja punktów i statystyk: Wyświetlanie zdobytych punktów przez poszczególnych graczy i całą drużynę w czasie rzeczywistym.
   3. Widok ligi i rankingu: Zaprojektowanie i implementacja strony, na której użytkownicy mogą przeglądać swoją pozycję w lidze.
   4. Profil użytkownika: Stworzenie strony profilu, gdzie użytkownik może zobaczyć swoje drużyny, historię wyników i inne personalne
      informacje.