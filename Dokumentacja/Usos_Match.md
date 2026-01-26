# 🎓 Dokumentacja Techniczna - Aplikacja UsosMatch

**Wersja:** 6.7
**Data:** 26.01.2026
**Autorzy:** Rozalia Mitkowska, Kamil Pawelczak

---

## 1. Wprowadzenie i Architektura Systemu

### 1.1. Cel Projektu
Aplikacja "UsosMatch" ma za zadanie rozwiązać problem logistyczny organizacji spotkań, umożliwiając studentom dobór partnera (do nauki, projektów lub randek) na podstawie **zgodności ich planów zajęć**. System minimalizuje marnowanie czasu na ustalanie terminów.

### 1.2. Architektura Systemu (REST API + SPA)
Projekt został zbudowany w nowoczesnej architekturze **Monorepo** z podziałem na:
*   **Backend (Serwer Logiki):** Java 17, Spring Boot 3 (Odpowiedzialny za obliczenia, dane i bezpieczeństwo).
*   **Frontend (Klient Graficzny):** React 18, Vite (Odpowiedzialny za interakcję, routing, i wyświetlanie).

---

## 2. Analiza i Projektowanie (Diagramy UML)

### 2.1. Diagram Przypadków Użycia
Diagram ilustruje relacje między aktorem (Student) a kluczowymi funkcjami.
![Diagram Przypadków Użycia](./Dokumentacja/diagram_przypadkow_uzycia.png)
*(Kluczowa jest zależność `<<extend>>` między Zarządzaniem Planem a Importem z USOS.)*

### 2.2. Diagram Klas
Diagram przedstawia strukturę backendu i relacje trwałe.
*   **Relacje Kluczowe:** `User` 1-do-wielu `TimeSlot` (grafik) oraz `User` wiele-do-wielu `Interest` (pasje).
*   **Kluczowe Encje:** `Match` (przechowuje `user1`, `user2` i `compatibilityScore`) oraz `Message` (do chatu).

![Diagram Klas](./Dokumentacja/diagram_klas.png)

### 2.3. Diagram Obiektów
Prezentuje instancje klas w konkretnym scenariuszu (`Ania` i `Marek`) i ich udane dopasowanie (wspólne zainteresowania + czas).

![Diagram Obiektów](./Dokumentacja/diagram_obiektow.png)

### 2.4. Diagram Komponentów React
Architektura interfejsu (SPA). Komponenty są logicznie rozdzielone na małe klocki (np. `InfoModal`, `Navbar`) oraz większe strony (np. `MatchingPage`).

![Diagram Komponentów React](./Dokumentacja/diagram_komponentow_react.png)

### 2.5. Diagram Sekwencji
Ilustracja logiczna procesu Dwustronnej Akceptacji w czacie. Pokazuje kolejność wywołań od kliknięcia przycisku "Zaproś" (Front) aż do zapisu statusu w bazie.

![Diagram Sekwencji](./Dokumentacja/diagram_sekwencji.png)

---

## 3. Implementacja - Logika Biznesowa

### 3.1. Algorytm Czasu i Walidacja (`TimeSlotService`)
*   **Import `.ics`:** System parsuje plik kalendarza i na podstawie zajęć **wylicza okienka** wolnego czasu w przedziale 8:00 - 23:00 (z 30-minutowym buforem).
*   **Blokada Kolizji:** Funkcja `overlaps()` (zarówno dla importu, jak i ręcznego dodawania) zapobiega powstawaniu duplikatów i nakładających się okienek, co jest krytyczne dla integralności grafiku.

### 3.2. Algorytm Dopasowania (`MatchingService`)
Obliczanie `Compatibility Score` zostało **znormalizowane do skali 0-100%**:
*   **Wspólny Czas (waga 80%):** Oceniany na podstawie liczby pokrywających się slotów.
*   **Wspólne Pasje (waga 20%):** Oceniany na podstawie liczby wspólnych zainteresowań (logika odporna na wielkość liter).

### 3.3. Maszyna Stanów Matcha
Proces akceptacji wymaga dwustronnej zgody:
*   **Statusy:** `PENDING` ➡️ `LIKED_BY_USER_X` ➡️ `MATCHED`.
*   **Filtrowanie:** Karty, które zostały już przez użytkownika odrzucone (`REJECTED`) lub zaakceptowane, są filtrowane i nie pojawiają się w zakładce "Ogień".

### 3.4. Szyfrowanie Danych
Zastosowano **`BCryptPasswordEncoder`** (Spring Security) do hashowania haseł użytkowników. Wszystkie dane są zapisywane w sposób, który uniemożliwia odczyt (hasła) i chroni przed atakami na bazę.