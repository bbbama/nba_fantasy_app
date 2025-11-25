# Następne Kroki Implementacji (Frontend)

Ten plik zawiera szczegółowy opis kolejnych kroków, które powinieneś podjąć, aby rozwinąć część frontendową aplikacji w React.

### Krok 1: Kontekst Autentykacji (AuthContext)

**Cel:** Stworzenie globalnego "miejsca" w aplikacji do przechowywania informacji o tym, czy użytkownik jest zalogowany, jaki ma token, oraz udostępnienie funkcji `login()` i `logout()`.

**Pliki do modyfikacji:**
1.  **`src/context/AuthContext.tsx` (nowy plik):**
    *   Stwórz kontekst (`AuthContext`) za pomocą `createContext`.
    *   Zdefiniuj `AuthProvider`, który będzie komponentem przechowującym stan (np. `token`, `isAuthenticated`).
    *   W `AuthProvider` zaimplementuj logikę funkcji `login(token)` (zapisuje token do `localStorage` i aktualizuje stan) oraz `logout()` (usuwa token i aktualizuje stan).
2.  **`src/index.tsx`:**
    *   Zaimportuj `AuthProvider`.
    *   Owiń komponent `<App />` w `<AuthProvider>`, aby cała aplikacja miała dostęp do kontekstu.

### Krok 2: Implementacja Logowania i Rejestracji

**Cel:** Sprawienie, by formularze logowania i rejestracji faktycznie działały i komunikowały się z backendem.

**Pliki do modyfikacji:**
1.  **`src/services/api.ts` (nowy plik):**
    *   Skonfiguruj `axios` do komunikacji z Twoim backendem (`http://localhost:8000`).
    *   Stwórz funkcje `loginUser(email, password)` i `registerUser(email, password)`, które będą wysyłać zapytania `POST` do backendu.
2.  **`src/pages/LoginPage.tsx`:**
    *   Użyj `useState` do przechowywania wartości pól email i hasło.
    *   Pobierz funkcję `login` z `AuthContext` za pomocą `useContext`.
    *   Po kliknięciu "Zaloguj", wywołaj `loginUser` z serwisu `api.ts`.
    *   Jeśli logowanie się powiedzie, wywołaj `login(otrzymany_token)` z kontekstu i przekieruj użytkownika na stronę główną (np. za pomocą hooka `useNavigate`).
3.  **`src/pages/RegisterPage.tsx`:**
    *   Zaimplementuj podobną logikę jak na stronie logowania, ale wywołując funkcję `registerUser`.
    *   Po udanej rejestracji, wyświetl komunikat i przekieruj na stronę logowania.

### Krok 3: Chronione Ścieżki (Private Routes)

**Cel:** Zabezpieczenie stron, które powinny być dostępne tylko dla zalogowanych użytkowników (np. strona główna z drużyną).

**Pliki do modyfikacji:**
1.  **`src/components/PrivateRoute.tsx` (nowy plik):**
    *   Stwórz komponent, który sprawdza, czy użytkownik jest zalogowany (korzystając z `AuthContext`).
    *   Jeśli jest zalogowany, komponent renderuje swoje `children` (czyli docelową stronę).
    *   Jeśli nie jest zalogowany, przekierowuje użytkownika na `/login` (używając komponentu `<Navigate to="/login" />`).
2.  **`src/App.tsx`:**
    *   Zaimportuj `PrivateRoute`.
    *   Owiń `Route` dla strony głównej (`<Route path="/" element={<HomePage />} />`) w komponent `PrivateRoute`:
        ```tsx
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        ```

### Krok 4: Pobieranie i Wyświetlanie Danych

**Cel:** Pobranie listy zawodników z backendu i wyświetlenie jej na dedykowanej stronie.

**Pliki do modyfikacji:**
1.  **`src/pages/PlayersPage.tsx` (nowy plik):**
    *   Stwórz nową stronę do wyświetlania zawodników.
    *   Użyj `useEffect` i `useState` do pobrania i przechowania listy zawodników.
    *   W `api.ts` stwórz funkcję `getPlayers(token)`, która wyśle zapytanie `GET /players` z tokenem autoryzacyjnym w nagłówku.
    *   Wyświetl dane w formie listy lub tabeli.
2.  **`src/App.tsx`:**
    *   Dodaj nową, chronioną ścieżkę `/players` do routera.
    *   Dodaj link do nowej strony w nawigacji.

Po zrealizowaniu tych kroków Twoja aplikacja będzie miała w pełni funkcjonalny system logowania, rejestracji oraz możliwość pobierania i wyświetlania danych z backendu.
