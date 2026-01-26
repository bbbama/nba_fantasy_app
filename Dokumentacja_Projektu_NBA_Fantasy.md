# Dokumentacja Projektu: NBA Fantasy App

## Wstęp i Cel Projektu
Projekt "NBA Fantasy App" to nowoczesna aplikacja webowa typu full-stack, stworzona z myślą o miłośnikach koszykówki i gier fantasy. Jej głównym celem jest umożliwienie użytkownikom tworzenia i zarządzania wirtualnymi drużynami NBA, śledzenia statystyk prawdziwych graczy oraz rywalizacji w ligach ze znajomymi. Aplikacja charakteryzuje się eleganckim, ciemnym motywem graficznym inspirowanym estetyką NBA, zapewniając spójne i intuicyjne doświadczenie użytkownika.

---

## Architektura Techniczna

Aplikacja zbudowana jest w architekturze klient-serwer z wykorzystaniem RESTful API do komunikacji.

### Backend (Część Serwerowa)
*   **Język Programowania:** Python 3.8+
*   **Framework:** FastAPI
    *   Wybrany ze względu na wysoką wydajność, łatwość tworzenia API, automatyczną walidację danych (Pydantic) i generowanie dokumentacji OpenAPI (Swagger UI).
*   **Baza Danych:** SQLite (wersja deweloperska)
    *   Używana z SQLAlchemy ORM, co pozwala na łatwą zmianę na inne relacyjne bazy danych (np. PostgreSQL) w środowisku produkcyjnym.
*   **Zarządzanie Zależnościami:** `pip` i wirtualne środowiska `venv`.
*   **Harmonogramer Zadań:** `APScheduler` do cyklicznej aktualizacji statystyk graczy.

### Frontend (Część Klientowa)
*   **Framework:** React 19 (TypeScript)
    *   Do budowy dynamicznego, komponentowego interfejsu użytkownika (Single Page Application - SPA).
*   **Język Programowania:** TypeScript
    *   Zapewnia statyczne typowanie, zwiększając czytelność, utrzymywalność i niezawodność kodu.
*   **Biblioteki UI/Stylizacja:**
    *   **Material-UI (MUI):** Bogaty zestaw gotowych, estetycznych i responsywnych komponentów UI, zgodnych z Material Design, co zapewnia spójny wygląd.
    *   **Tailwind CSS:** Framework CSS typu utility-first, uzupełniający Material-UI, umożliwiający szybkie i elastyczne stylowanie oraz precyzyjną kontrolę nad wyglądem.
*   **Routing:** React Router DOM
    *   Do zarządzania nawigacją w aplikacji SPA.
*   **Zarządzanie Stanem:** React Context API (AuthContext dla autentykacji/autoryzacji).
*   **Komunikacja z API:** `axios` do wykonywania żądań HTTP.

---

## Główne Funkcjonalności Programu

### 1. Zarządzanie Użytkownikami
*   **Rejestracja i Logowanie:** Bezpieczny system uwierzytelniania użytkowników oparty na tokenach JWT.
*   **Profile Użytkownika:**
    *   Możliwość aktualizacji **nicku** użytkownika. Nick musi być unikalny w systemie.
    *   Możliwość zmiany hasła.
*   **Role Użytkowników:** `user` (zwykły użytkownik) i `admin` (administrator). Pierwszy zarejestrowany użytkownik automatycznie otrzymuje rolę `admin`.
*   **Panel Administratora:** Dostępny tylko dla administratorów. Umożliwia:
    *   Przeglądanie wszystkich zarejestrowanych użytkowników.
    *   Usuwanie dowolnego użytkownika.
    *   Resetowanie hasła użytkownika do wartości domyślnej.
    *   Ręczne wyzwalanie synchronizacji danych graczy NBA.

### 2. Zarządzanie Drużyną i Graczami
*   **Przeglądanie Graczy:** Dostęp do listy wszystkich dostępnych graczy NBA, z informacjami o pozycji, drużynie oraz punktach fantasy.
*   **Wyszukiwanie Graczy:** Wyszukiwarka umożliwiająca szybkie znalezienie graczy po nazwisku.
*   **Moja Drużyna:**
    *   Użytkownicy mogą dodawać i usuwać graczy do swojej wirtualnej drużyny.
    *   **Walidacja składu:** System automatycznie sprawdza ograniczenia pozycji (np. maks. 4 Obrońców, 4 Skrzydłowych, 2 Centrujących) oraz całkowitej liczby graczy (maks. 10).
    *   Wyświetlanie sumy punktów fantasy drużyny użytkownika.

### 3. System Lig (Nowość!)
*   **Tworzenie Lig:** Użytkownicy mogą tworzyć własne, prywatne ligi.
*   **Dołączanie do Lig:** Użytkownicy mogą dołączać do lig za pomocą unikalnego kodu zaproszenia.
*   **Przeglądanie Lig:** Strona wyświetlająca listę wszystkich lig, do których użytkownik należy. Administratorzy widzą wszystkie ligi w systemie i mogą je usuwać.
*   **Szczegóły Ligi:** Strona prezentująca nazwę ligi, jej właściciela, kod zaproszenia oraz listę członków wraz z ich nickami (lub e-mailami) i punktami fantasy.
*   **Usuwanie Lig:** Właściciele ligi oraz administratorzy mają możliwość usunięcia ligi.

---

## Mechanika Gry (Podstawowe Zasady)

*   **Punkty Fantasy:** Każdy gracz NBA generuje punkty fantasy na podstawie swoich rzeczywistych statystyk meczowych (punkty, zbiórki, asysty, itp.). Aplikacja śledzi średnie punkty fantasy graczy oraz punkty z ostatniego meczu.
*   **Budowanie Drużyny:** Użytkownicy wybierają do 10 graczy do swojej drużyny, przestrzegając limitów pozycji, aby stworzyć zbalansowany skład.
*   **Ranking:** Globalna tablica wyników (Leaderboard) wyświetla użytkowników posortowanych według ich całkowitych punktów fantasy, motywując do rywalizacji.
*   **Ligi Prywatne:** Umożliwiają rywalizację w mniejszych grupach znajomych, z osobną tablicą wyników w ramach ligi (do dalszej rozbudowy).

---

## Aspekty UI/UX

*   **Nowoczesny Design:** Aplikacja posiada spójny, elegancki motyw ciemny, inspirowany kolorystyką i dynamiką ligi NBA. Wykorzystanie Material-UI i Tailwind CSS zapewnia profesjonalny wygląd.
*   **Responsywność:** Interfejs użytkownika jest zaprojektowany tak, aby optymalnie wyświetlać się i działać na różnych urządzeniach – od smartfonów po monitory desktopowe.
*   **Intuicyjna Nawigacja:** Jasno zorganizowane menu nawigacyjne umożliwia łatwy dostęp do wszystkich sekcji aplikacji.
*   **Globalne Powiadomienia:** System powiadomień `Snackbar` dostarcza użytkownikowi dyskretnych komunikatów o sukcesach, błędach i innych zdarzeniach, nie przerywając jego pracy.

---

## Instrukcje Uruchomienia Lokalnego

Szczegółowe instrukcje dotyczące przygotowania środowiska i uruchomienia aplikacji lokalnie znajdują się w pliku `README.md` w głównym katalogu projektu.

---

## Dalszy Rozwój (Potencjalne Ulepszenia)

*   **Handel Graczami/Draft:** Wprowadzenie systemu wymiany graczy lub draftu w ramach lig.
*   **Statystyki Historyczne:** Rozszerzenie danych o graczach o statystyki historyczne.
*   **Szczegółowe Rankingi Ligowe:** Oddzielne rankingi i zarządzanie punktami w ramach poszczególnych lig.
*   **Powiadomienia w Aplikacji:** System powiadomień o wydarzeniach w ligach lub zmianach statystyk.
*   **Testy Automatyczne:** Rozbudowa pokrycia testami jednostkowymi i integracyjnymi.