# Dokumentacja Projektu: NBA Fantasy

## 1. Wprowadzenie

Projekt "NBA Fantasy" to kompleksowy serwis typu klient-serwer, stworzony w ramach zajęć projektowych, mający na celu symulację rozgrywki fantasy związanej z ligą koszykówki NBA. Aplikacja umożliwia użytkownikom zarządzanie własnymi drużynami, śledzenie statystyk graczy oraz rywalizację z innymi uczestnikami. Projekt kładzie nacisk na nowoczesne rozwiązania technologiczne, intuicyjny interfejs użytkownika oraz zgodność z obowiązującymi standardami webowymi.

## 2. Technologie Wykorzystane w Projekcie

Projekt "NBA Fantasy" został zaimplementowany jako aplikacja typu Single Page Application (SPA) z wykorzystaniem architektury RESTful API.

### Część Serwerowa (Backend)

*   **Język Programowania**: Python
*   **Framework**: FastAPI
    *   Wybrany ze względu na wysoką wydajność, łatwość pisania kodu, wbudowaną walidację danych (Pydantic) oraz automatyczną dokumentację API (Swagger/OpenAPI).
*   **Baza Danych**: Dowolna relacyjna baza danych (np. PostgreSQL, MySQL)
    *   FastAPI w połączeniu z odpowiednimi bibliotekami (np. SQLAlchemy) umożliwia elastyczny dostęp do danych relacyjnych, co jest kluczowe dla przechowywania informacji o graczach, użytkownikach i drużynach.
*   **Dostęp do Danych**: RESTful API
    *   Backend udostępnia zestaw endpointów REST, które umożliwiają części klienckiej (frontendowi) komunikację i manipulację danymi.

### Część Klienta (Frontend)

*   **Framework**: React (z TypeScriptem)
    *   Wykorzystany do budowy dynamicznego i responsywnego interfejsu użytkownika. React doskonale sprawdza się w tworzeniu SPA, zapewniając efektywne zarządzanie stanem i komponentową strukturę.
*   **Język Programowania**: JavaScript (TypeScript)
    *   TypeScript został zastosowany w celu zwiększenia czytelności, utrzymywalności i niezawodności kodu poprzez statyczne typowanie.
*   **Biblioteki UI/Stylizacja**:
    *   **Material-UI (MUI)**: Zapewnia bogaty zestaw gotowych, estetycznych i responsywnych komponentów UI, zgodnych z Material Design. Przyspiesza rozwój interfejsu i gwarantuje spójny wygląd.
    *   **Tailwind CSS**: Wykorzystany jako framework CSS typu utility-first, umożliwiający szybkie i elastyczne stylowanie komponentów oraz layoutów, komplementując Material-UI i pozwalając na precyzyjną kontrolę nad wyglądem.
*   **Routing**: React Router DOM
    *   Umożliwia nawigację wewnątrz aplikacji SPA bez konieczności przeładowywania strony.
*   **Zarządzanie Stanem Uwierzytelnienia**: Własny kontekst uwierzytelnienia (AuthContext) oparty na React Context API.

## 3. Realizacja Wymagań Projektowych

Projekt "NBA Fantasy" spełnia następujące podstawowe założenia:

*   **Serwis WWW w Technologii Klient-Serwer**: Projekt jest wyraźnie podzielony na niezależną część kliencką (SPA w React) i serwerową (REST API w FastAPI).
*   **Zawartość Merytoryczna i Funkcjonalna**:
    *   **Funkcjonalność serwerowa**: Backend w FastAPI zapewnia dostęp do bazy danych, obsługuje logikę biznesową, autentykację i autoryzację, a także dostarcza dane o graczach i użytkownikach poprzez REST API.
    *   **Funkcjonalność klienta**: Frontend w React umożliwia interakcję z API, wyświetlanie danych, zarządzanie drużyną, rejestrację, logowanie oraz dostęp do różnych sekcji aplikacji (gracze, moja drużyna, ranking, panel admina, profil).
*   **Możliwe Rozwiązania Technologiczne (SPA)**: Projekt został zrealizowany jako aplikacja typu SPA (Single Page Application) z wykorzystaniem stylu REST do komunikacji między klientem a serwerem.
*   **Bazy Danych**: W projekcie można wykorzystać dowolną relacyjną bazę danych (np. PostgreSQL, MySQL), co jest zgodne z wymaganiami. Backend jest przygotowany do integracji z różnymi systemami baz danych.
*   **Część Serwerowa Serwisu**: Zaimplementowana w języku Python z wykorzystaniem frameworka FastAPI, co spełnia wymagania dotyczące użycia języków programowania (Python, PHP, JavaScript/TypeScript).
*   **Część Klienta Serwisu**: Zrealizowana przy użyciu biblioteki React z TypeScriptem, co jest zgodne z wymogiem wykorzystania biblioteki do realizacji aplikacji SPA (np. Vue czy React).
*   **Uwierzytelnienie i Autoryzacja**:
    *   Aplikacja posiada pełne uwierzytelnienie użytkowników.
    *   Wprowadzono co najmniej dwie role autoryzowane: `user` (zwykły użytkownik) oraz `admin` (administrator). Dostęp do poszczególnych zasobów i stron (np. Panel Admina) jest kontrolowany na podstawie roli użytkownika.
    *   Funkcjonalność stanu sesji jest realizowana poprzez **tokeny JWT**, które są bezpiecznie przechowywane i przesyłane w nagłówkach HTTP.
*   **Walidacja Projektu i Graficzna Poprawność**:
    *   Strony WWW generowane po stronie klienta (React) są tworzone z myślą o zgodności ze standardami HTML5.
    *   Interfejs użytkownika jest "graficznie poprawny" i estetyczny dzięki wykorzystaniu Material-UI oraz Tailwind CSS, zapewniając spójny i nowoczesny wygląd.
    *   Aplikacja jest projektowana tak, aby poprawnie wyświetlać się w popularnych przeglądarkach (Firefox, Chrome, Edge) i dąży do walidacji W3C - HTML5.
*   **Standard Kodowania**: Cały projekt, zarówno frontend, jak i backend, używa standardu kodowania **UTF-8**.
*   **Elegancja Wykonania**: Zastosowanie TypeScript, komponentowej architektury React, nowoczesnych bibliotek UI (Material-UI, Tailwind CSS) oraz czystego kodu FastAPI przyczynia się do wysokiej elegancji i czytelności wykonania projektu.

## 4. Podsumowanie

Projekt "NBA Fantasy" stanowi solidną implementację serwisu klient-serwer, spełniając wszystkie wymagania projektowe z nawiązką. Wykorzystane technologie gwarantują wydajność, skalowalność i nowoczesny wygląd, a architektura umożliwia dalszą rozbudowę funkcjonalności. Wdrożenie autentykacji, autoryzacji oraz dbałość o standardy webowe czynią z niego kompletne i profesjonalne rozwiązanie.
